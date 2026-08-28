import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as services from './index';

const replay = { replayVersion: '1.0', players: [], monsters: [] };
const okResponse = (body: unknown) =>
  ({ ok: true, status: 200, json: vi.fn().mockResolvedValue(body) }) as unknown as Response;

describe('replay services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('exports replay request functions', () => {
    expect(services.fetchReplay).toBeTypeOf('function');
    expect(services.fetchReplayApi).toBeTypeOf('function');
  });

  it('parses string outputRaw from GET responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      okResponse({ outputId: 'id', outputRaw: JSON.stringify(replay) }) as Response
    );
    await expect(services.fetchReplay('/parse/id', new AbortController())).resolves.toMatchObject(
      replay
    );
  });

  it('parses object outputRaw from GET responses', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse({ outputRaw: replay }) as unknown as Response);
    await expect(services.fetchReplay('/parse/id', new AbortController())).resolves.toMatchObject(
      replay
    );
  });

  it('accepts legacy direct GET replay responses', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(replay) as Response);
    await expect(services.fetchReplay('/parse/id', new AbortController())).resolves.toEqual(replay);
  });

  it('reports failed GET responses with the request ID', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({ error: 'Missing', requestId: 'req-1' }),
    } as unknown as Response);
    await expect(services.fetchReplay('/parse/id', new AbortController())).rejects.toThrow(
      'Missing (requestId: req-1)'
    );
  });

  it('handles IP lookup failure and response JSON failure', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockRejectedValueOnce(new Error('IP lookup failed'));
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new Error('invalid json')),
    } as unknown as Response);

    await expect(services.fetchReplay('/parse/id', new AbortController())).rejects.toThrow(
      'Parser response did not include replay data'
    );
  });

  it('parses string outputRaw from POST responses', async () => {
    vi.mocked(fetch).mockResolvedValue(
      okResponse({ outputRaw: JSON.stringify(replay) }) as Response
    );
    await expect(
      services.fetchReplayApi(new FormData(), new AbortController())
    ).resolves.toMatchObject(replay);
  });

  it('parses object and legacy POST responses', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(okResponse({ outputRaw: replay }) as Response)
      .mockResolvedValueOnce(okResponse({ outputRaw: replay }) as Response)
      .mockResolvedValueOnce(okResponse(replay) as Response)
      .mockResolvedValueOnce(okResponse(replay) as Response);
    await expect(
      services.fetchReplayApi(new FormData(), new AbortController())
    ).resolves.toMatchObject(replay);

    await expect(services.fetchReplayApi(new FormData(), new AbortController())).resolves.toEqual(
      replay
    );
  });

  it('reports POST failures with a fallback message', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(okResponse({}) as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);
    await expect(services.fetchReplayApi(new FormData(), new AbortController())).rejects.toThrow(
      'Request failed with status 500'
    );
  });

  it('rejects malformed or missing POST replay data', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse({ outputRaw: '{bad' }) as Response);
    await expect(services.fetchReplayApi(new FormData(), new AbortController())).rejects.toThrow(
      'Invalid parser outputRaw JSON'
    );
    vi.mocked(fetch).mockResolvedValue(okResponse({}) as Response);
    await expect(services.fetchReplayApi(new FormData(), new AbortController())).rejects.toThrow(
      'Parser response did not include replay data'
    );
  });
});
