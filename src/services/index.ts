import { BASE_PATH, PARSER_URL } from '@/constants';
import type { IMob, IReplayData, ISkill } from '@/types';
import * as yaml from 'js-yaml';

let cachedClientIpAddress: string | null = null;
let clientIpLookupPromise: Promise<string> | null = null;

/**
 * Checks whether a string value is a valid IPv4 or IPv6 address.
 *
 * Used as a heuristic to decide whether `window.location.hostname` can be
 * used as a client IP fallback when the external lookup fails.
 *
 * @param value - The string to test.
 * @returns `true` if the string matches a simple IPv4 or IPv6 pattern.
 */
const isIpAddress = (value: string): boolean => {
  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^[0-9a-f:]+$/i;

  return ipv4Pattern.test(value) || ipv6Pattern.test(value);
};

/**
 * Resolves the client's public IP address, caching the result for subsequent calls.
 *
 * Resolution order:
 * 1. Returns the cached value immediately if a previous lookup succeeded.
 * 2. Joins an in-flight lookup promise if one is already running.
 * 3. Makes a `GET` request to `https://api.ipify.org?format=json`.
 * 4. Falls back to `window.location.hostname` if it looks like an IP address.
 * 5. Returns an empty string if all options fail.
 *
 * The resolved IP is forwarded to the parser API via the `X-Client-IP` request
 * header so the server can associate requests with clients behind shared proxies.
 *
 * @param controller - AbortController used to cancel the IP lookup request.
 * @returns A promise resolving to the client's IP address, or `''` on failure.
 */
const resolveClientIpAddress = async (controller: AbortController): Promise<string> => {
  if (cachedClientIpAddress) {
    return cachedClientIpAddress;
  }

  if (clientIpLookupPromise) {
    return clientIpLookupPromise;
  }

  clientIpLookupPromise = (async () => {
    if (typeof window === 'undefined') {
      return '';
    }

    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        signal: controller.signal,
      });

      if (response.ok) {
        const payload = (await response.json()) as { ip?: string };

        if (typeof payload.ip === 'string' && payload.ip) {
          cachedClientIpAddress = payload.ip;
          return payload.ip;
        }
      }
    } catch {
      // Ignore lookup failures and fallback to hostname-derived value.
    }

    const hostname = window.location.hostname.trim();
    const fallbackIp = isIpAddress(hostname) ? hostname : '';

    cachedClientIpAddress = fallbackIp;
    return fallbackIp;
  })();

  try {
    return await clientIpLookupPromise;
  } finally {
    clientIpLookupPromise = null;
  }
};

/**
 * Fetches a previously parsed replay by its share URL.
 *
 * The function resolves the client IP before making the request and attaches
 * it as an `X-Client-IP` header. The response payload can be in one of three
 * shapes:
 *
 * - `{ outputRaw: string }` – the replay data is JSON-encoded inside a string.
 * - `{ outputRaw: object }` – the replay data is an inline object.
 * - Raw `IReplayData` – legacy format with top-level `players` and `monsters` keys.
 *
 * @param link - The full URL to the shared replay resource.
 * @param controller - AbortController used to cancel the request.
 * @returns A promise resolving to the parsed {@link IReplayData}.
 * @throws {Error} When the HTTP response is not OK.
 * @throws {Error} When the response payload contains no recognisable replay data.
 * @throws {Error} When `outputRaw` is a string that cannot be parsed as JSON.
 */
export const fetchReplay = async (
  link: string,
  controller: AbortController
): Promise<IReplayData> => {
  const clientIpAddress = await resolveClientIpAddress(controller);
  const headers: HeadersInit = clientIpAddress ? { 'X-Client-IP': clientIpAddress } : {};

  const response = await fetch(`${link}`, {
    method: 'GET',
    headers,
    signal: controller.signal,
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const apiError = payload as { error?: string; requestId?: string } | null;
    const errorMessage = apiError?.error ?? `Request failed with status ${response.status}`;
    const requestIdLabel = apiError?.requestId ? ` (requestId: ${apiError.requestId})` : '';

    throw new Error(`${errorMessage}${requestIdLabel}`);
  }

  const parsedPayload = payload as {
    requestId?: string;
    outputRaw?: unknown;
    outputId?: string;
    replayFileName?: string;
  } | null;

  if (typeof parsedPayload?.outputRaw === 'string') {
    try {
      return {
        outputId: parsedPayload.outputId,
        replayFileName: parsedPayload.replayFileName,
        ...(JSON.parse(parsedPayload.outputRaw) as IReplayData),
      };
    } catch {
      const requestIdLabel = parsedPayload.requestId
        ? ` (requestId: ${parsedPayload.requestId})`
        : '';

      throw new Error(`Invalid parser outputRaw JSON${requestIdLabel}`);
    }
  }

  if (parsedPayload?.outputRaw && typeof parsedPayload.outputRaw === 'object') {
    return {
      outputId: parsedPayload.outputId,
      replayFileName: parsedPayload.replayFileName,
      ...(parsedPayload.outputRaw as IReplayData),
    };
  }

  if (payload && typeof payload === 'object' && 'players' in payload && 'monsters' in payload) {
    return payload as IReplayData;
  }

  const requestIdLabel = parsedPayload?.requestId ? ` (requestId: ${parsedPayload.requestId})` : '';
  throw new Error(`Parser response did not include replay data${requestIdLabel}`);
};

/**
 * Uploads a replay file to the parser API and returns the parsed replay data.
 *
 * The request is a `multipart/form-data` `POST` with the replay file attached
 * under the `replay` key. The client IP is resolved beforehand and forwarded
 * as an `X-Client-IP` header.
 *
 * The response handling is identical to {@link fetchReplay}: all three payload
 * shapes (`outputRaw` string, `outputRaw` object, and raw `IReplayData`) are
 * supported.
 *
 * @param formData - FormData containing the replay file under the `replay` key.
 * @param controller - AbortController used to cancel the request.
 * @returns A promise resolving to the parsed {@link IReplayData}.
 * @throws {Error} When the HTTP response is not OK.
 * @throws {Error} When the response payload contains no recognisable replay data.
 * @throws {Error} When `outputRaw` is a string that cannot be parsed as JSON.
 */
export const fetchReplayApi = async (
  formData: FormData,
  controller: AbortController
): Promise<IReplayData> => {
  const clientIpAddress = await resolveClientIpAddress(controller);
  const headers: HeadersInit = clientIpAddress ? { 'X-Client-IP': clientIpAddress } : {};

  const response = await fetch(`${PARSER_URL}`, {
    method: 'POST',
    body: formData,
    headers,
    signal: controller.signal,
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const apiError = payload as { error?: string; requestId?: string } | null;
    const errorMessage = apiError?.error ?? `Request failed with status ${response.status}`;
    const requestIdLabel = apiError?.requestId ? ` (requestId: ${apiError.requestId})` : '';

    throw new Error(`${errorMessage}${requestIdLabel}`);
  }

  const parsedPayload = payload as {
    requestId?: string;
    outputRaw?: unknown;
    outputId?: string;
    replayFileName?: string;
  } | null;

  // New API shape: replay data is provided as a stringified JSON payload in outputRaw.
  if (typeof parsedPayload?.outputRaw === 'string') {
    try {
      return {
        outputId: parsedPayload.outputId,
        replayFileName: parsedPayload.replayFileName,
        ...(JSON.parse(parsedPayload.outputRaw) as IReplayData),
      };
    } catch {
      const requestIdLabel = parsedPayload.requestId
        ? ` (requestId: ${parsedPayload.requestId})`
        : '';

      throw new Error(`Invalid parser outputRaw JSON${requestIdLabel}`);
    }
  }

  // Backward compatibility: outputRaw can already be an object.
  if (parsedPayload?.outputRaw && typeof parsedPayload.outputRaw === 'object') {
    return {
      outputId: parsedPayload.outputId,
      replayFileName: parsedPayload.replayFileName,
      ...(parsedPayload.outputRaw as IReplayData),
    };
  }

  // Backward compatibility: older API directly returned replay JSON.
  if (payload && typeof payload === 'object' && 'players' in payload && 'monsters' in payload) {
    return payload as IReplayData;
  }

  const requestIdLabel = parsedPayload?.requestId ? ` (requestId: ${parsedPayload.requestId})` : '';
  throw new Error(`Parser response did not include replay data${requestIdLabel}`);
};

/**
 * Fetches and parses the skill database YAML from the public assets folder.
 *
 * The YAML file is loaded from `{BASE_PATH}yaml/skill_db.yml` and converted
 * to a JavaScript object using `js-yaml`. Only the `Body` array is returned.
 *
 * @param controller - AbortController used to cancel the fetch request.
 * @returns A promise resolving to an array of {@link ISkill} entries.
 */
export const fetchSkillDb = async (controller: AbortController) => {
  const skillDbYML = await fetch(`${BASE_PATH}yaml/skill_db.yml`, {
    signal: controller.signal,
  }).then((res) => res.text());
  const skillDb = (yaml.load(skillDbYML) as { Body: ISkill[] }).Body;

  return skillDb;
};

/**
 * Fetches and parses the mob database YAML from the public assets folder.
 *
 * The YAML file is loaded from `{BASE_PATH}yaml/mob_db.yml` and converted
 * to a JavaScript object using `js-yaml`. Only the `Body` array is returned.
 *
 * @param controller - AbortController used to cancel the fetch request.
 * @returns A promise resolving to an array of {@link IMob} entries.
 */
export const fetchMobDb = async (controller: AbortController) => {
  const mobDbYML = await fetch(`${BASE_PATH}yaml/mob_db.yml`, { signal: controller.signal }).then(
    (res) => res.text()
  );
  const mobDb = (yaml.load(mobDbYML) as { Body: IMob[] }).Body;

  return mobDb;
};
