import type { IParsedReplay, ReplayBreakdownProps } from '@/types';
import React, { useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
import { getMonsterName, parseReplayOutput } from '@/utils';
import Table from './Table';
import commaNumber from 'comma-number';
import prettyMilliseconds from 'pretty-ms';
import DropdownSelect from './DropdownSelect';
import HorizontalTabs from './HorizontalTabs';
import TextImage from './TextImage';
import { MONSTER_IMAGE_URL, TEXT_IMAGE_VARIANTS } from '@/constants';

const ReplayBreakdown: React.FC<ReplayBreakdownProps> = ({
  apiResponse = null,
  skillDb = null,
  mobDb = null,
  fileName = '',
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
      <HorizontalTabs
        extraContent={
          <div className="">
            Showing file: <strong>{fileName ? `${fileName}` : ''}</strong>
          </div>
        }
        tabs={[
          {
            id: 'players',
            label: 'Breakdown per Player',
            content: (
              <div>
                <h2>Breakdown Per Player</h2>
                <Table
                  headers={[
                    'Class',
                    'Player Name',
                    'Total Damage',
                    'Highest Damage',
                    'Skill Breakdown',
                  ]}
                  rows={replayToDisplay.breakdownPerPlayer
                    .filter((player) => player.highestDamage.damage)
                    .map((player) => [
                      <TextImage
                        variant={TEXT_IMAGE_VARIANTS.JOB}
                        keyId={player.jobId}
                        keyInfo={player.jobName}
                      />,
                      player.playerName,
                      player.highestDamage.damage ? commaNumber(player.totalDamageDealt) : 'N/A',
                      player.highestDamage.damage ? (
                        <div>
                          {commaNumber(player.highestDamage.damage)}
                          <br />
                          <TextImage
                            textBefore={<i>using</i>}
                            variant={TEXT_IMAGE_VARIANTS.SKILL}
                            keyId={player.highestDamage.skillId}
                            keyInfo={player.highestDamage.skillName}
                          />
                          <i>vs.</i>{' '}
                          {getMonsterName(
                            player.highestDamage.monsterName,
                            player.highestDamage.isMvp
                          )}
                        </div>
                      ) : (
                        'N/A'
                      ),
                      player.skillDamages.length > 0 ? (
                        <Table
                          headers={['Skill Name', 'Total Damage', 'No. of Hits', 'Highest Damage']}
                          rows={player.skillDamages.map((skill) => [
                            <TextImage
                              keyId={skill.skillId}
                              keyInfo={skill.skillInfo}
                              variant={TEXT_IMAGE_VARIANTS.SKILL}
                            />,
                            commaNumber(skill.damage),
                            commaNumber(skill.noOfHits),
                            <div>
                              {commaNumber(skill.highestDamage)} <i>vs.</i>{' '}
                              {getMonsterName(skill.highestMonsterName, skill.highestIsMvp)}
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
            ),
          },
          {
            id: 'monsters',
            label: 'Breakdown per Monster',
            content: (
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
                    'Highest Burst Damage',
                    'Breakdown per player',
                    'Breakdown per skill',
                  ]}
                  rowClassNames={[
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
                        src={MONSTER_IMAGE_URL.replace('PLACEHOLDER_TEXT', monster.monsterId)}
                        alt={monster.name}
                        className="mx-auto max-w-24 h-auto"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />,
                      <div>
                        <strong>{getMonsterName(monster.name, monster.isMvp)}</strong>
                        {` x ${monster.amount}`}
                        <br />
                        <i>received </i>
                        {commaNumber(monster.damage)}
                        <br />
                        <i>killed in </i>
                        {!isNaN(monster.fightDuration.to - monster.fightDuration.from)
                          ? prettyMilliseconds(
                              Number(monster.fightDuration.to - monster.fightDuration.from),
                              {
                                subSecondsAsDecimals: true,
                              }
                            )
                          : 'N/A'}
                      </div>,
                      monster.highestDamage.damage > 0 ? (
                        <div>
                          {commaNumber(monster.highestDamage.damage)}
                          <br />
                          <TextImage
                            textBefore={<i>by</i>}
                            variant={TEXT_IMAGE_VARIANTS.JOB}
                            keyId={monster.highestDamage.jobId}
                            keyInfo={monster.highestDamage.playerName}
                            title={monster.highestDamage.jobName}
                          />
                          <TextImage
                            textBefore={<i>using</i>}
                            variant={TEXT_IMAGE_VARIANTS.SKILL}
                            keyId={monster.highestDamage.skillId}
                            keyInfo={monster.highestDamage.skillName}
                          />
                        </div>
                      ) : (
                        'N/A'
                      ),
                      monster.playerDamages.length > 0 ? (
                        <Table
                          headers={['Player Name', 'Total Damage', 'No. of Hits', 'Highest Damage']}
                          rows={monster.playerDamages.map((player) => [
                            <TextImage
                              variant={TEXT_IMAGE_VARIANTS.JOB}
                              keyId={player.jobId}
                              keyInfo={player.playerName}
                              title={player.jobName}
                            />,
                            commaNumber(player.damage),
                            commaNumber(player.noOfHitsUnique),
                            <div>
                              {commaNumber(player.highestDamage.damage)}
                              <TextImage
                                textBefore={<i>using</i>}
                                variant={TEXT_IMAGE_VARIANTS.SKILL}
                                keyId={player.highestDamage.skillId}
                                keyInfo={player.highestDamage.skillName}
                              />
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
                            <TextImage
                              keyId={skill.skillId}
                              keyInfo={skill.skillInfo}
                              variant={TEXT_IMAGE_VARIANTS.SKILL}
                            />,
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
            ),
          },
          {
            id: 'skills',
            label: 'Support Skill Usage',
            content: (
              <div>
                <h2>Support Skill Usage</h2>
                <Table
                  headers={[
                    'Skill Name',
                    'Total Usage Count',
                    'Top Spammer',
                    'Breakdown per Player',
                  ]}
                  rows={replayToDisplay.skillUsage.map((skill) => [
                    <TextImage
                      keyId={skill.skillId}
                      keyInfo={skill.skillInfo}
                      variant={TEXT_IMAGE_VARIANTS.SKILL}
                    />,
                    commaNumber(skill.skillUsageCount),

                    <TextImage
                      variant={TEXT_IMAGE_VARIANTS.JOB}
                      keyId={skill.highestSkillUsagePlayerJobId}
                      keyInfo={
                        skill.highestSkillUsagePlayerName
                          ? `${skill.highestSkillUsagePlayerName} (${commaNumber(skill.highestSkillUsageCount)}x)`
                          : 'N/A'
                      }
                      title={skill.highestSkillUsagePlayerJobName}
                    />,

                    skill.playerSkills.length > 0 ? (
                      <Table
                        headers={['Class', 'Player Name', 'Usage Count']}
                        rows={skill.playerSkills.map((playerSkill) => [
                          <TextImage
                            keyId={playerSkill.jobId}
                            keyInfo={playerSkill.jobName}
                            variant={TEXT_IMAGE_VARIANTS.JOB}
                          />,
                          playerSkill.playerName,
                          commaNumber(playerSkill.skillUsageCount),
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
            ),
          },
        ]}
      />
    </div>
  ) : (
    <>
      <HorizontalTabs
        tabs={[
          {
            id: 'players',
            label: 'Breakdown per Player',
            content: (
              <SkeletonLoader
                rows={
                  (apiResponse?.players?.length ?? 0) <= 10
                    ? (apiResponse?.players?.length ?? 0)
                    : 5
                }
              />
            ),
          },
          {
            id: 'monsters',
            label: 'Breakdown per Monster',
            content: (
              <SkeletonLoader
                rows={
                  (apiResponse?.monsters?.length ?? 0) <= 10
                    ? (apiResponse?.monsters?.length ?? 0)
                    : 10
                }
                columns={4}
              />
            ),
          },
          {
            id: 'skills',
            label: 'Skill Usage',
            content: <SkeletonLoader rows={5} columns={4} />,
          },
        ]}
      />
    </>
  );
};

export default React.memo(ReplayBreakdown);
