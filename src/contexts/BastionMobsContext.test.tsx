import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BastionMobsProvider, useBastionMobs } from './BastionMobsContext';

const waves = [
  {
    wave: 1,
    isSkippable: true,
    remindersSetup: [],
    monsters: [{ monsterId: 1, monsterName: 'Poring', isMvp: false }],
  },
];

const okResponse = (body: unknown) =>
  ({ ok: true, status: 200, json: vi.fn().mockResolvedValue(body) }) as unknown as Response;

const BastionMobsConsumer = () => {
  const { waves: waveList, isLoading, hasError, reload } = useBastionMobs();

  if (isLoading) return <div>Loading</div>;
  if (hasError)
    return (
      <button type="button" onClick={reload}>
        Retry
      </button>
    );

  return (
    <ul>
      {waveList.map((wave) => (
        <li key={wave.wave}>{`Wave ${wave.wave}`}</li>
      ))}
    </ul>
  );
};

describe('BastionMobsContext', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('throws when used outside a BastionMobsProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<BastionMobsConsumer />)).toThrow(
      'useBastionMobs must be used within a BastionMobsProvider.'
    );

    consoleError.mockRestore();
  });

  it('shows a loading state before the fetch resolves', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    render(
      <BastionMobsProvider>
        <BastionMobsConsumer />
      </BastionMobsProvider>
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('provides fetched waves data once loaded', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(
      <BastionMobsProvider>
        <BastionMobsConsumer />
      </BastionMobsProvider>
    );

    await waitFor(() => expect(screen.getByText('Wave 1')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith('/bastion_mobs.json', expect.any(Object));
  });

  it('shows an error state when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);

    render(
      <BastionMobsProvider>
        <BastionMobsConsumer />
      </BastionMobsProvider>
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument());
  });

  it('shows an error state when the fetch rejects', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network error'));

    render(
      <BastionMobsProvider>
        <BastionMobsConsumer />
      </BastionMobsProvider>
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument());
  });

  it('refetches the waves when reload is invoked after an error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network error'));
    vi.mocked(fetch).mockResolvedValueOnce(okResponse(waves));

    render(
      <BastionMobsProvider>
        <BastionMobsConsumer />
      </BastionMobsProvider>
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(screen.getByText('Wave 1')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
