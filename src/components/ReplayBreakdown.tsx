import type { IParsedReplay, ReplayBreakdownProps } from '@/types';
import React, { useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
import { parseReplayOutput } from '@/utils';
import Table from './Table';
import commaNumber from 'comma-number';
import prettyMilliseconds from 'pretty-ms';
import DropdownSelect from './DropdownSelect';

const ReplayBreakdown: React.FC<ReplayBreakdownProps> = ({
  apiResponse = null,
  skillDb = null,
  mobDb = null,
}) => {
  const [isParsingDone, setIsParsingDone] = React.useState<boolean>(false);
  const [replayToDisplay, setReplayToDisplay] = React.useState<IParsedReplay | null>(null);
  const hasRun = React.useRef(false);
  const [mobMode, setMobMode] = React.useState<number>(0);

  useEffect(() => {
    if (!hasRun.current && replayToDisplay === null && apiResponse) {
      const parsedOutput = parseReplayOutput(apiResponse, skillDb, mobDb);
      hasRun.current = true;
      setReplayToDisplay(parsedOutput);
    }

    return () => {};
  }, [apiResponse, skillDb, mobDb]);

  useEffect(() => {
    if (replayToDisplay !== null) {
      setIsParsingDone(true);
    }
    return () => {};
  }, [replayToDisplay]);

  return isParsingDone && replayToDisplay ? (
    <div className="flex flex-col">
      <div className="h-6" />
      <div>
        <h2>Breakdown Per Player</h2>
        <Table
          headers={['Class', 'Player Name', 'Total Damage', 'Highest Damage', 'Skill Breakdown']}
          rows={replayToDisplay.breakdownPerPlayer
            .filter((player) => player.highestDamage.damage)
            .map((player) => [
              player.jobName,
              player.playerName,
              player.highestDamage.damage ? commaNumber(player.totalDamageDealt) : 'N/A',
              player.highestDamage.damage ? (
                <div>
                  {commaNumber(player.highestDamage.damage)}
                  <br />
                  <i>using</i> {player.highestDamage.skillName}
                  <br />
                  <i>vs.</i>{' '}
                  {`${player.highestDamage.monsterName} ${player.highestDamage.isMvp ? '(MVP)' : ''}`}
                </div>
              ) : (
                'N/A'
              ),
              player.skillDamages.length > 0 ? (
                <Table
                  headers={['Skill Name', 'Total Damage', 'No. of Hits', 'Highest Damage']}
                  rows={player.skillDamages.map((skill) => [
                    skill.skillInfo,
                    commaNumber(skill.damage),
                    commaNumber(skill.noOfHits),
                    <div>
                      {commaNumber(skill.highestDamage)} <i>vs.</i>{' '}
                      {`${skill.highestMonsterName} ${skill.highestIsMvp ? '(MVP)' : ''}`}
                    </div>,
                  ])}
                />
              ) : (
                'N/A'
              ),
            ])}
          className="w-full"
        />
      </div>
      <div className="h-6" />
      <div>
        <h2>Breakdown Per Monster</h2>
        <DropdownSelect
          select={mobMode.toString()}
          options={[
            { id: 0, value: '0', label: 'All Monsters' },
            { id: 1, value: '1', label: 'MVP Monsters' },
            { id: 2, value: '2', label: 'Normal Mobs' },
          ]}
          onChange={(e) => setMobMode(Number(e.target.value))}
          id="mob-mode"
        />

        <Table
          headers={[
            '',
            'Monster Name',
            'Total Damage Dealt',
            'Fight Duration',
            'Highest Burst Damage',
            'Breakdown per player',
            'Breakdown per skill',
          ]}
          rowClassNames={[
            'align-middle',
            'align-middle',
            'align-middle',
            'align-middle',
            'align-middle',
            'align-top',
            'align-top',
          ]}
          rows={replayToDisplay.breakdownPerMonsterUnique
            .filter((monster) => {
              if (mobMode === 0) return true;
              return monster.isMvp === (mobMode === 1 ? true : false);
            })
            .map((monster) => [
              <img
                src={`https://talontales.com/panel/data/monsters/${monster.monsterId}.gif`}
                alt={monster.name}
                className="mx-auto"
                loading="lazy"
              />,
              `${monster.name} ${monster.isMvp ? '(MVP)' : ''} x ${monster.amount}`,
              commaNumber(monster.damage),
              !isNaN(monster.fightDuration.to - monster.fightDuration.from)
                ? prettyMilliseconds(
                    Number(monster.fightDuration.to - monster.fightDuration.from),
                    {
                      subSecondsAsDecimals: true,
                    }
                  )
                : 'N/A',
              monster.highestDamage.damage > 0 ? (
                <div>
                  {commaNumber(monster.highestDamage.damage)}
                  <br />
                  <i>by</i> {monster.highestDamage.playerName}
                  <br />
                  <i>using</i> {monster.highestDamage.skillName}
                </div>
              ) : (
                'N/A'
              ),
              monster.playerDamages.length > 0 ? (
                <Table
                  headers={['Player Name', 'Total Damage', 'No. of Hits', 'Highest Damage']}
                  rows={monster.playerDamages.map((player) => [
                    player.playerName,
                    commaNumber(player.damage),
                    commaNumber(player.noOfHitsUnique),
                    <div>
                      {commaNumber(player.highestDamage.damage)} <i>using</i>{' '}
                      {player.highestDamage.skillName}
                    </div>,
                  ])}
                  className="w-full"
                />
              ) : (
                'N/A'
              ),
              monster.skillDamages.length > 0 ? (
                <Table
                  headers={['Skill Name', 'Total Damage', 'No. of Hits']}
                  rows={monster.skillDamages.map((skill) => [
                    skill.skillInfo,
                    commaNumber(skill.damage),
                    commaNumber(skill.noOfHitsUnique),
                  ])}
                  className="w-full"
                />
              ) : (
                'N/A'
              ),
            ])}
          className="w-full"
        />
      </div>
    </div>
  ) : (
    <>
      <SkeletonLoader
        rows={(apiResponse?.players?.length ?? 0) <= 10 ? (apiResponse?.players?.length ?? 0) : 5}
        columns={5}
      />
      <SkeletonLoader
        rows={
          (apiResponse?.monsters?.length ?? 0) <= 10 ? (apiResponse?.monsters?.length ?? 0) : 10
        }
        columns={7}
      />
    </>
  );
};

export default React.memo(ReplayBreakdown);
