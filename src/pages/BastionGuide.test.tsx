import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BastionGuide from './BastionGuide';

class ResizeObserverStub {
  observe() {}

  unobserve() {}

  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const waves = [
  { wave: 1, monsters: [{ monsterId: 1, monsterName: 'Poring', isMvp: false }] },
  {
    wave: 2,
    monsters: [
      { monsterId: 2, monsterName: 'Fabre', isMvp: false },
      { monsterId: 3, monsterName: 'Pupa', isMvp: true },
    ],
  },
];

const okResponse = (body: unknown) =>
  ({ ok: true, status: 200, json: vi.fn().mockResolvedValue(body) }) as unknown as Response;

describe('BastionGuide', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('shows a loading state before waves are fetched', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    render(<BastionGuide />);

    expect(screen.getByText('Loading waves...')).toBeInTheDocument();
  });

  it('renders the wave/monster table once waves are loaded', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Wave')).toBeInTheDocument());
    expect(screen.getByText('Monster')).toBeInTheDocument();
    expect(screen.getByText('Poring')).toBeInTheDocument();
    expect(screen.getByText('Fabre')).toBeInTheDocument();
    expect(screen.getByText('Pupa (MVP)')).toBeInTheDocument();
  });

  it('renders the meteor timer iframe', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Wave')).toBeInTheDocument());
    expect(screen.getByTitle('Meteor timer')).toHaveAttribute('src', '/meteor_timer.html');
  });

  it('shows an error state and can retry when the fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network error'));
    vi.mocked(fetch).mockResolvedValueOnce(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() =>
      expect(screen.getByText(/An error occurred while parsing the replay\./)).toBeInTheDocument()
    );

    screen.getByText('Click me to retry').click();

    await waitFor(() => expect(screen.getByText('Wave')).toBeInTheDocument());
  });
});
