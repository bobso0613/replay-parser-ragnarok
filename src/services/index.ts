import { BASE_PATH, PARSER_URL } from '@/constants';
import type { IMob, IReplayData, ISkill } from '@/types';
import * as yaml from 'js-yaml';

let cachedClientIpAddress: string | null = null;
let clientIpLookupPromise: Promise<string> | null = null;

const isIpAddress = (value: string): boolean => {
  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^[0-9a-f:]+$/i;

  return ipv4Pattern.test(value) || ipv6Pattern.test(value);
};

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

export const fetchSkillDb = async (controller: AbortController) => {
  const skillDbYML = await fetch(`${BASE_PATH}yaml/skill_db.yml`, {
    signal: controller.signal,
  }).then((res) => res.text());
  const skillDb = (yaml.load(skillDbYML) as { Body: ISkill[] }).Body;

  return skillDb;
};

export const fetchMobDb = async (controller: AbortController) => {
  const mobDbYML = await fetch(`${BASE_PATH}yaml/mob_db.yml`, { signal: controller.signal }).then(
    (res) => res.text()
  );
  const mobDb = (yaml.load(mobDbYML) as { Body: IMob[] }).Body;

  return mobDb;
};
