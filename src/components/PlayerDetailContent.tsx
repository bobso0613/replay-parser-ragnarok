import { useState } from 'react';
import type { ReactNode } from 'react';
import { MONSTER_IMAGE_URL, TEXT_IMAGE_VARIANTS, TOOLTIP_POSITION } from '@/constants/index.ts';
import type { IPlayerHighestDamage } from '@/types';
import { getMonsterName } from '@/utils';
import commaNumber from 'comma-number';
import DropdownSelect from './DropdownSelect';
import Table from './Table';
import TextImage from './TextImage';
import Tooltip from './Tooltip';

type PlayerDetailStat = {
  label: string;
  value: ReactNode | IPlayerHighestDamage;
};

type PlayerDetailSkill = {
  skillId: string;
  name: string;
  totalDamage?: ReactNode;
  hitCount?: ReactNode;
  highestDamage?: ReactNode;
  totalUsage?: ReactNode;
};

type PlayerDetailItem = {
  itemId: string;
  name: string;
  amount: ReactNode;
};

type PlayerDetailMonster = {
  monsterId: string;
  name: string;
  isMvp: boolean;
  amount: number;
  damage: ReactNode;
  highestBurst: IPlayerHighestDamage;
  skillBreakdown: PlayerDetailSkill[];
};

export type PlayerDetailContentProps = {
  playerId: string;
  playerName: string;
  jobId: number;
  jobName: string;
  statistics: PlayerDetailStat[];
  offensiveSkills: PlayerDetailSkill[];
  defensiveSkills: PlayerDetailSkill[];
  itemsUsed: PlayerDetailItem[];
  monstersKilled: PlayerDetailMonster[];
};

const DAMAGE_STAT_LABELS = new Set(['Total Damage', 'MVP Damage']);

const formatDamage = (value: PlayerDetailStat['value']) =>
  typeof value === 'number' && value > 0 ? commaNumber(value) : 'N/A';

const formatCount = (value: PlayerDetailStat['value']): ReactNode => {
  if (typeof value === 'number') {
    return commaNumber(value);
  }

  return isHighestBurst(value) ? 'N/A' : value;
};

const isHighestBurst = (value: PlayerDetailStat['value']): value is IPlayerHighestDamage =>
  typeof value === 'object' && value !== null && 'damage' in value;

type NestedHeaderProps = {
  headers: ReactNode[];
  columnWidths: Array<number | string>;
};

const NestedHeader = ({ headers, columnWidths }: NestedHeaderProps) => (
  <div className="pt-3">
    <div className="flex text-left font-bold uppercase tracking-wide text-slate-200">
      {headers.map((header, index) => (
        <div
          key={`${String(header)}-${index}`}
          className="shrink-0 px-4 last:pr-0"
          style={{ width: columnWidths[index] }}
        >
          {header}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Presentational player-detail layout rendered inside the shared modal.
 * All display data is supplied by the parent.
 *
 * @param props - {@link PlayerDetailContentProps}
 * @returns Player statistics, skills, items, and monster sections.
 */
const PlayerDetailContent = ({
  playerId,
  statistics,
  offensiveSkills,
  defensiveSkills,
  itemsUsed,
  monstersKilled,
}: PlayerDetailContentProps) => {
  const [monsterMode, setMonsterMode] = useState(0);
  const filteredMonsters = monstersKilled.filter((monster) => {
    if (monsterMode === 0) {
      return true;
    }

    return monster.isMvp === (monsterMode === 1);
  });

  return (
    <div className="flex flex-col gap-8" data-player-id={playerId}>
      <section>
        <h3 className="mb-3 text-xl font-semibold">Statistics</h3>
        <dl className="grid gap-x-8 gap-y-1 border p-4 sm:grid-cols-2 rounded-lg border-slate-200/50 ">
          {statistics.map((statistic) => (
            <div key={statistic.label} className="flex gap-1">
              <dt className="font-semibold">{statistic.label}:</dt>
              <dd>
                {DAMAGE_STAT_LABELS.has(statistic.label) ? (
                  formatDamage(statistic.value)
                ) : statistic.label === 'Highest Burst' &&
                  isHighestBurst(statistic.value) &&
                  statistic.value.damage !== 0 ? (
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    {formatDamage(statistic.value.damage)}
                    <TextImage
                      textBefore={<i>using</i>}
                      variant={TEXT_IMAGE_VARIANTS.SKILL}
                      keyId={statistic.value.skillId}
                      keyInfo={statistic.value.skillName}
                    />{' '}
                    <i>vs.</i> {getMonsterName(statistic.value.monsterName, statistic.value.isMvp)}
                  </div>
                ) : (
                  formatCount(statistic.value)
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h3 className="mb-3 text-xl font-semibold">Items Used</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-slate-200/50 p-4">
          {itemsUsed.map((item) => (
            <div key={item.itemId} className="flex items-center gap-1">
              <TextImage
                variant={TEXT_IMAGE_VARIANTS.ITEM}
                keyId={item.itemId}
                keyInfo={item.name}
              />
              <span>
                <strong>X</strong> {formatCount(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-xl font-semibold">Offensive Skills</h3>
          <Table
            headers={['Skill Name', 'Total Damage', 'No. of Hits', 'Highest Damage']}
            sortableColumns={[0, 1, 2]}
            sortValues={offensiveSkills.map((skill) => [
              skill.name,
              typeof skill.totalDamage === 'string' || typeof skill.totalDamage === 'number'
                ? skill.totalDamage
                : null,
              typeof skill.hitCount === 'string' || typeof skill.hitCount === 'number'
                ? skill.hitCount
                : null,
            ])}
            rows={offensiveSkills.map((skill) => [
              <TextImage
                variant={TEXT_IMAGE_VARIANTS.SKILL}
                keyId={skill.skillId}
                keyInfo={skill.name}
              />,
              formatDamage(skill.totalDamage),
              formatCount(skill.hitCount),
              formatDamage(skill.highestDamage),
            ])}
            className="w-full"
          />
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold">Defensive Skills</h3>
          <Table
            headers={['Skill Name', 'Total Usage']}
            sortableColumns={[0, 1]}
            sortValues={defensiveSkills.map((skill) => [
              skill.name,
              typeof skill.totalUsage === 'string' || typeof skill.totalUsage === 'number'
                ? skill.totalUsage
                : null,
            ])}
            rows={defensiveSkills.map((skill) => [
              <TextImage
                variant={TEXT_IMAGE_VARIANTS.SKILL}
                keyId={skill.skillId}
                keyInfo={skill.name}
              />,
              formatCount(skill.totalUsage),
            ])}
            className="w-full"
          />
        </section>
      </div>
      <section>
        <h3 className="mb-3 text-xl font-semibold">Monsters Killed</h3>
        <DropdownSelect
          id="player-monster-mode"
          select={monsterMode.toString()}
          options={[
            { id: 0, value: '0', label: 'All Monsters' },
            { id: 1, value: '1', label: 'MVP Monsters' },
            { id: 2, value: '2', label: 'Normal Mobs' },
          ]}
          onChange={(event) => setMonsterMode(Number(event.target.value))}
        />
        <Table
          compact
          headers={[
            '',
            'Monster Name',
            'Total Damage',
            'Highest Burst',
            <div key="skill-breakdown-header">
              <div className="mb-1 text-center">Breakdown per Skill</div>
              <NestedHeader
                headers={['Skill Name', 'Total Damage', 'No. of Hits']}
                columnWidths={['50%', '30%', '20%']}
              />
            </div>,
          ]}
          enableVirtualization
          virtualColumnWeights={[1, 2, 2, 2, 4]}
          virtualRowHeight={260}
          virtualTableHeight={800}
          fitViewport={false}
          sortableColumns={[1, 2, 3]}
          sortValues={filteredMonsters.map((monster) => [
            null,
            getMonsterName(monster.name, monster.isMvp),
            typeof monster.damage === 'number' ? monster.damage : 0,
            monster.highestBurst.damage,
          ])}
          rowClassNames={[
            'align-middle text-center',
            'align-middle',
            'align-middle',
            'align-middle',
            'align-top',
          ]}
          rows={filteredMonsters.map((monster) => [
            <Tooltip
              content={
                <img
                  src={MONSTER_IMAGE_URL.replace('PLACEHOLDER_TEXT', monster.monsterId)}
                  alt={monster.name}
                  className="w-auto"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              }
              placement={TOOLTIP_POSITION.BOTTOM}
              className="mx-auto flex h-full max-w-6 items-center justify-center"
            >
              <img
                src={MONSTER_IMAGE_URL.replace('PLACEHOLDER_TEXT', monster.monsterId)}
                alt={monster.name}
                className="mx-auto max-w-6 h-auto"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </Tooltip>,
            `${getMonsterName(monster.name, monster.isMvp)} x ${formatCount(monster.amount)}`,
            formatDamage(monster.damage),
            monster.highestBurst.damage > 0 ? (
              <div>
                {commaNumber(monster.highestBurst.damage)}
                <TextImage
                  textBefore={<i>using</i>}
                  variant={TEXT_IMAGE_VARIANTS.SKILL}
                  keyId={monster.highestBurst.skillId}
                  keyInfo={monster.highestBurst.skillName}
                />
              </div>
            ) : (
              'N/A'
            ),
            monster.skillBreakdown.length > 0 ? (
              <Table
                compact
                headers={[]}
                columnWidths={['50%', '30%', '20%']}
                rows={monster.skillBreakdown.map((skill) => [
                  <TextImage
                    keyId={skill.skillId}
                    keyInfo={skill.name}
                    variant={TEXT_IMAGE_VARIANTS.SKILL}
                  />,
                  formatDamage(skill.totalDamage),
                  formatCount(skill.hitCount),
                ])}
                className="my-0"
              />
            ) : (
              'N/A'
            ),
          ])}
          className="w-full"
        />
      </section>
    </div>
  );
};

export default PlayerDetailContent;
