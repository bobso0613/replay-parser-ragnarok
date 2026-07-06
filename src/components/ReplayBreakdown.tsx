import type { IParsedReplay, ReplayBreakdownProps } from '@/types';
import React, { useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
import { getMonsterName, parseReplayOutput } from '@/utils';
import Table from './Table';
import commaNumber from 'comma-number';
import prettyMilliseconds from 'pretty-ms';
import DropdownSelect from './DropdownSelect';
import HorizontalTabs from './HorizontalTabs';
import StickyButton from './StickyButton';
import TextImage from './TextImage';
import { MONSTER_IMAGE_URL, TEXT_IMAGE_VARIANTS } from '@/constants';

type TabContentWithStickyProps = {
  children: React.ReactNode;
};

const TabContentWithSticky: React.FC<TabContentWithStickyProps> = ({ children }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="relative">
      {children}
      <StickyButton scrollContainerRef={contentRef} />
    </div>
  );
};

const ReplayBreakdown: React.FC<ReplayBreakdownProps> = ({
  apiResponse = null,
  skillDb = null,
  mobDb = null,
  fileName = '',
}) => {
  const [isParsingDone, setIsParsingDone] = React.useState<boolean>(false);
  const [isLinkCopied, setIsLinkCopied] = React.useState<boolean>(false);
  const [replayToDisplay, setReplayToDisplay] = React.useState<IParsedReplay | null>(null);
  const hasRun = React.useRef(false);
  const [mobMode, setMobMode] = React.useState<number>(0);
  const replaySharePath = `${import.meta.env.VITE_REPLAY_URL_SHARE}`.replace(
    'ID_HERE',
    apiResponse?.outputId ?? ''
  );
  const COPY_PASTED_LINK =
    replaySharePath.startsWith('http://') || replaySharePath.startsWith('https://')
      ? replaySharePath
      : `${window.location.origin}${replaySharePath.startsWith('/') ? replaySharePath : `/${replaySharePath}`}`;

  const handleCopyOutputLink = async () => {
    try {
      await navigator.clipboard.writeText(COPY_PASTED_LINK);
      setIsLinkCopied(true);
      window.setTimeout(() => {
        setIsLinkCopied(false);
      }, 1500);
    } catch {
      setIsLinkCopied(false);
    }
  };

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
          <div className="flex min-w-0 items-center gap-3">
            <div className="truncate">
              Showing file: <strong>{fileName ? `${fileName}` : ''}</strong>
            </div>
            <button
              type="button"
              onClick={handleCopyOutputLink}
              className="shrink-0 rounded-md border bg-blue-400/40 border-slate-500/60 px-2.5 py-1 text-slate-200 hover:border-slate-300 hover:text-white"
            >
              {isLinkCopied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        }
        tabs={[
          {
            id: 'players',
            label: 'Breakdown per Player',
            content: (
              <TabContentWithSticky>
                <h2>Breakdown Per Player</h2>
                <Table
                  headers={[
                    'Player Name',
                    'Total Damage',
                    'MVP Damage',
                    'Highest Damage',
                    'Skill Breakdown',
                  ]}
                  enableVirtualization
                  virtualColumnWeights={[1, 1, 1, 1, 4]}
                  virtualRowHeight={220}
                  virtualTableHeight={780}
                  sortableColumns={[0, 1, 2]}
                  sortValues={replayToDisplay.breakdownPerPlayer.map((player) => [
                    player.playerName,
                    player.totalDamageDealt,
                    player.totalDamageDealthMvps,
                  ])}
                  rows={replayToDisplay.breakdownPerPlayer.map((player) => [
                    <TextImage
                      variant={TEXT_IMAGE_VARIANTS.JOB}
                      keyId={player.jobId}
                      keyInfo={player.playerName}
                      title={player.jobName}
                    />,
                    player.highestDamage.damage ? commaNumber(player.totalDamageDealt) : 'N/A',
                    player.highestDamage.damage ? commaNumber(player.totalDamageDealthMvps) : 'N/A',
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
              </TabContentWithSticky>
            ),
          },
          {
            id: 'monsters',
            label: 'Breakdown per Monster',
            content: (
              <TabContentWithSticky>
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
                  enableVirtualization
                  virtualColumnWeights={[1, 2, 2, 4, 3]}
                  virtualRowHeight={260}
                  virtualTableHeight={780}
                  sortableColumns={[1]}
                  sortValues={replayToDisplay.breakdownPerMonsterUnique.map((monster) => [
                    null,
                    getMonsterName(monster.name, monster.isMvp),
                  ])}
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
              </TabContentWithSticky>
            ),
          },
          {
            id: 'skills',
            label: 'Support Skill Usage',
            content: (
              <TabContentWithSticky>
                <h2>Support Skill Usage</h2>
                <Table
                  headers={[
                    'Skill Name',
                    'Total Usage Count',
                    'Top Spammer',
                    'Breakdown per Player',
                  ]}
                  enableVirtualization
                  virtualColumnWeights={[1, 1, 1, 4]}
                  virtualRowHeight={180}
                  virtualTableHeight={780}
                  sortableColumns={[0, 1]}
                  sortValues={replayToDisplay.skillUsage.map((skill) => [
                    skill.skillInfo,
                    skill.skillUsageCount,
                  ])}
                  rowClassNames={['align-middle', 'align-middle', 'align-middle', 'align-top']}
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
                        headers={['Player Name', 'Usage Count']}
                        rows={skill.playerSkills.map((playerSkill) => [
                          <TextImage
                            keyId={playerSkill.jobId}
                            keyInfo={playerSkill.playerName}
                            variant={TEXT_IMAGE_VARIANTS.JOB}
                            title={playerSkill.jobName}
                          />,
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
              </TabContentWithSticky>
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
                columns={4}
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
