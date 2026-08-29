import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PlayerDetailContent from './PlayerDetailContent';

class ResizeObserverStub {
  observe() {}

  unobserve() {}

  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const props = {
  playerId: 'player-1',
  playerName: 'Alice',
  jobId: 1,
  jobName: 'Swordman',
  statistics: [
    { label: 'Total Damage', value: 1000 },
    { label: 'Deaths', value: 2000 },
  ],
  offensiveSkills: [
    {
      skillId: 'fire-bolt',
      name: 'Fire Bolt',
      totalDamage: 1000,
      hitCount: 5000,
      highestDamage: 400,
    },
  ],
  defensiveSkills: [{ skillId: 'heal', name: 'Heal', totalUsage: 3000 }],
  itemsUsed: [{ itemId: 'blue-potion', name: 'Blue Potion', amount: 4000 }],
  monstersKilled: [
    {
      monsterId: 'poring',
      name: 'Poring',
      isMvp: false,
      amount: 1,
      damage: 1000,
      highestBurst: {
        monsterId: 'poring',
        monsterName: 'Poring',
        isMvp: false,
        skillId: 'fire-bolt',
        skillName: 'Fire Bolt',
        damage: 400,
      },
      skillBreakdown: [
        {
          skillId: 'fire-bolt',
          name: 'Fire Bolt',
          totalDamage: 1000,
          hitCount: 5000,
          highestDamage: 400,
        },
      ],
    },
  ],
};

describe('PlayerDetailContent', () => {
  it('renders the supplied player details in each section', () => {
    const { container } = render(<PlayerDetailContent {...props} />);

    expect(container.firstElementChild).toHaveAttribute('data-player-id', 'player-1');
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Offensive Skills')).toBeInTheDocument();
    expect(screen.getByText('Defensive Skills')).toBeInTheDocument();
    expect(screen.getByText('Items Used')).toBeInTheDocument();
    expect(screen.getByText('Monsters Killed')).toBeInTheDocument();
    expect(screen.getAllByText('Fire Bolt')).toHaveLength(3);
    expect(screen.getByText('Heal')).toBeInTheDocument();
    expect(screen.getByText('Blue Potion')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('2,000')).toBeInTheDocument();
    expect(screen.getByText('3,000')).toBeInTheDocument();
    expect(screen.getAllByText('4,000')).toHaveLength(1);
    expect(screen.getAllByText('5,000')).toHaveLength(2);
    expect(screen.getAllByText('1,000')).toHaveLength(4);
    expect(screen.getByText('Poring x 1')).toBeInTheDocument();
  });

  it('formats positive damage values and shows N/A for zero damage', () => {
    render(
      <PlayerDetailContent
        {...props}
        offensiveSkills={[{ ...props.offensiveSkills[0], totalDamage: 0, highestDamage: 0 }]}
        monstersKilled={[
          {
            ...props.monstersKilled[0],
            highestBurst: { ...props.monstersKilled[0].highestBurst, damage: 0 },
          },
        ]}
      />
    );

    expect(screen.getAllByText('N/A')).toHaveLength(3);
    expect(screen.getAllByText('1,000').length).toBeGreaterThan(0);
  });

  it('filters Monsters Killed by MVP status', () => {
    const { container } = render(
      <PlayerDetailContent
        {...props}
        monstersKilled={[
          ...props.monstersKilled,
          {
            ...props.monstersKilled[0],
            monsterId: 'mvp-poring',
            name: 'MVP Poring',
            isMvp: true,
          },
        ]}
      />
    );

    fireEvent.change(container.querySelector('#player-monster-mode')!, { target: { value: '1' } });

    expect(screen.getByText('MVP Poring (MVP) x 1')).toBeInTheDocument();
    expect(screen.queryByText('Poring x 1')).toBeNull();
  });
});
