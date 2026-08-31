import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BastionGuide from './BastionGuide';

class ResizeObserverStub {
  observe() {}

  unobserve() {}

  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const waves = [
  {
    wave: 1,
    isSkippable: true,
    remindersSetup: [],
    monsters: [{ monsterId: 1, monsterName: 'Poring', isMvp: false }],
  },
  {
    wave: 2,
    isSkippable: true,
    remindersSetup: [],
    monsters: [
      { monsterId: 2, monsterName: 'Fabre', isMvp: false },
      { monsterId: 3, monsterName: 'Pupa', isMvp: true },
    ],
  },
  {
    wave: 3,
    isSkippable: false,
    remindersSetup: [],
    monsters: [{ monsterId: 4, monsterName: 'Lunatic', isMvp: false }],
  },
  {
    wave: 30,
    isSkippable: false,
    remindersSetup: ['isDangerousFloor'],
    monsters: [{ monsterId: 5, monsterName: 'Eddga', isMvp: true }],
  },
  {
    wave: 60,
    isSkippable: false,
    remindersSetup: [],
    monsters: [{ monsterId: 6, monsterName: 'Golem', isMvp: false }],
  },
  {
    wave: 15,
    isSkippable: false,
    remindersSetup: ['isMvpFloor'],
    monsters: [
      { monsterId: 7, monsterName: 'Moonlight Flower', isMvp: true },
      { monsterId: 8, monsterName: 'Skeleton', isMvp: false },
    ],
  },
  {
    wave: 75,
    isSkippable: false,
    remindersSetup: ['isDangerousFloor', 'restockFlag'],
    monsters: [{ monsterId: 9, monsterName: 'Morroc - Ghost', isMvp: false }],
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
    expect(screen.getByText('Mobs')).toBeInTheDocument();
    expect(screen.getByText('MVPs')).toBeInTheDocument();
    expect(screen.getByText('Poring')).toBeInTheDocument();
    expect(screen.getByText('Fabre')).toBeInTheDocument();
    expect(screen.getByText('Pupa (MVP)')).toBeInTheDocument();

    const pupaRow = screen.getByText('Pupa (MVP)').closest('tr');
    expect(pupaRow?.cells[1]).toHaveTextContent('Fabre');
    expect(pupaRow?.cells[2]).toHaveTextContent('Pupa (MVP)');
  });

  it('renders the meteor timer iframe', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Wave')).toBeInTheDocument());
    expect(screen.getByTitle('Meteor timer')).toHaveAttribute('src', '/meteor_timer.html');
  });

  it('merges skippable waves into the next available wave when the checkbox is checked', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    const { container } = render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Poring')).toBeInTheDocument());

    const waveCellsBefore = Array.from(container.querySelectorAll('td')).map(
      (cell) => cell.textContent
    );
    expect(waveCellsBefore).toEqual(expect.arrayContaining(['1', '2', '3']));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Merge skippable waves into next wave' }));

    const waveCellsAfter = Array.from(container.querySelectorAll('td')).map(
      (cell) => cell.textContent
    );
    expect(waveCellsAfter).not.toContain('1');
    expect(waveCellsAfter).not.toContain('2');
    expect(waveCellsAfter).toContain('3');

    expect(screen.getByText('Poring')).toBeInTheDocument();
    expect(screen.getByText('Fabre')).toBeInTheDocument();
    expect(screen.getByText('Pupa (MVP)')).toBeInTheDocument();
    expect(screen.getByText('Lunatic')).toBeInTheDocument();
  });

  it('hides waves 1-55 except dangerous floors when the checkbox is checked', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Lunatic')).toBeInTheDocument());
    expect(screen.getByText('Eddga (MVP)')).toBeInTheDocument();
    expect(screen.getByText('Golem')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Hide waves 1-55 (except dangerous floors)' })
    );

    expect(screen.queryByText('Poring')).not.toBeInTheDocument();
    expect(screen.queryByText('Lunatic')).not.toBeInTheDocument();
    expect(screen.getByText('Eddga (MVP)')).toBeInTheDocument();
    expect(screen.getByText('Golem')).toBeInTheDocument();
  });

  it('shows only dangerous floor waves when the checkbox is checked', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Eddga (MVP)')).toBeInTheDocument());
    expect(screen.getByText('Poring')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Show only dangerous floors' }));

    expect(screen.queryByText('Poring')).not.toBeInTheDocument();
    expect(screen.getByText('Eddga (MVP)')).toBeInTheDocument();
    expect(screen.getByText('Morroc - Ghost')).toBeInTheDocument();
  });

  it('shows only MVP monsters, or a generic "Mobs" label, except on dangerous floors', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Lunatic')).toBeInTheDocument());
    expect(screen.getByText('Fabre')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Only show MVPs (except dangerous floors)' })
    );

    expect(screen.queryByText('Lunatic')).not.toBeInTheDocument();
    expect(screen.queryByText('Fabre')).not.toBeInTheDocument();
    expect(screen.getByText('Pupa (MVP)')).toBeInTheDocument();
    expect(screen.getAllByText('Mobs').length).toBeGreaterThan(0);
    expect(screen.getByText('Eddga (MVP)')).toBeInTheDocument();
    expect(screen.getByText('Morroc - Ghost')).toBeInTheDocument();
  });

  it('shows reminder emojis and a legend, and highlights isMvpFloor rows', async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse(waves));

    render(<BastionGuide />);

    await waitFor(() => expect(screen.getByText('Moonlight Flower (MVP)')).toBeInTheDocument());

    expect(screen.getByText('Dangerous floor')).toBeInTheDocument();
    expect(screen.getByText('MVP floor')).toBeInTheDocument();
    expect(screen.getByText('Restock')).toBeInTheDocument();
    // legend + wave 30 + wave 75
    expect(screen.getAllByText('⚠️')).toHaveLength(3);
    // legend + wave 75
    expect(screen.getAllByText('📦')).toHaveLength(2);
    // legend + wave 15
    expect(screen.getAllByText('👺')).toHaveLength(2);

    const mvpFloorRow = screen.getByText('Moonlight Flower (MVP)').closest('.bg-yellow-300\\/10');
    expect(mvpFloorRow).not.toBeNull();
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
