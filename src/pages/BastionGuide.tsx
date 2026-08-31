import Table from '@/components/Table';
import SectionLoading from '@/components/SectionLoading';
import ErrorDetails from '@/components/ErrorDetails';
import { BastionMobsProvider, useBastionMobs } from '@/contexts/BastionMobsContext';
import { useEffect, useRef, useState } from 'react';
import { calculateViewportHeight, getElementHeight } from '@/utils/table-utils';
import { MONSTER_IMAGE_URL, TOOLTIP_POSITION } from '@/constants/index.ts';
import Tooltip from '@/components/Tooltip';
import {
  getCurrentEntryIndex,
  getMonsterName,
  getMvpOnlyMonsters,
  getWaveNotes,
  hideNonDangerousEarlyWaves,
  mergeSkippableWaves,
  REMINDER_NOTES,
  showOnlyDangerousFloorWaves,
} from '@/utils';

const VIEWPORT_BOTTOM_GAP = 24;
const VIEWPORT_SAFETY_BUFFER = 12;
const MIN_SECTION_HEIGHT = 320;
/** Single source of truth for the `isMvpFloor` row highlight — change here to restyle every row. */
const MVP_FLOOR_ROW_CLASS = 'bg-yellow-300/10';

/**
 * Bastion wave/monster table, backed by {@link useBastionMobs}.
 *
 * Renders one of three states depending on the shared fetch:
 *
 * 1. **Loading** — {@link SectionLoading} is shown while `bastion_mobs.json` is being fetched.
 * 2. **Error** — {@link ErrorDetails} is shown with a retry button wired to `reload`.
 * 3. **Loaded** — three columns above a virtualised {@link Table}: "Filters" contains four
 *    checkboxes, "Legend" lists {@link REMINDER_NOTES}, and "Current MVP" shows the image,
 *    name, and ID of the weekly MVP selected from the final wave's `randomPool`:
 *    - Show only dangerous floor waves ({@link showOnlyDangerousFloorWaves}).
 *    - Only show MVP monsters, falling back to a generic "Mobs" label for waves with
 *      no MVP ({@link getMvpOnlyMonsters}); dangerous floor waves are exempt.
 *    - Merge skippable waves' monsters into the next kept wave ({@link mergeSkippableWaves}).
 *    - Hide non-dangerous waves 1-55 ({@link hideNonDangerousEarlyWaves}).
 *
 *    Rows flagged `isMvpFloor` get a soft yellow background (applied to the whole `<tr>`
 *    via `rowBackgroundClassNames`), and a Notes column shows an emoji per reminder flag
 *    ({@link getWaveNotes}), each with a tooltip showing its label matching the legend. A wave
 *    with a `randomPool` also displays the MVP selected by the weekly
 *    {@link getCurrentEntryIndex} rotation instead of its fixed MVP list.
 */
const BastionWaveTable = () => {
  const { waves, isLoading, hasError, reload } = useBastionMobs();
  const [mergeSkippable, setMergeSkippable] = useState(false);
  const [hideEarlyWaves, setHideEarlyWaves] = useState(false);
  const [showOnlyDangerous, setShowOnlyDangerous] = useState(false);
  const [onlyShowMvps, setOnlyShowMvps] = useState(false);

  if (isLoading) {
    return <SectionLoading label="Loading waves..." />;
  }

  if (hasError) {
    return <ErrorDetails retryOnClick={reload} />;
  }

  let filteredWaves = mergeSkippable ? mergeSkippableWaves(waves) : waves;
  filteredWaves = hideEarlyWaves ? hideNonDangerousEarlyWaves(filteredWaves) : filteredWaves;
  filteredWaves = showOnlyDangerous ? showOnlyDangerousFloorWaves(filteredWaves) : filteredWaves;

  const mvpPool = waves.at(-1)?.randomPool ?? [];
  const mvpPoolDisplay = mvpPool[getCurrentEntryIndex(mvpPool.length)];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row gap-2">
        <div className="w-1/3 flex flex-col gap-2 text-slate-300">
          <strong>Filters:</strong>
          <label className="mb-2 flex w-fit items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={showOnlyDangerous}
              onChange={(event) => setShowOnlyDangerous(event.target.checked)}
            />
            Show only dangerous floors
          </label>
          <label className="mb-2 flex w-fit items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={onlyShowMvps}
              onChange={(event) => setOnlyShowMvps(event.target.checked)}
            />
            Only show MVPs (except dangerous floors)
          </label>
          <label className="mb-2 flex w-fit items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={mergeSkippable}
              onChange={(event) => setMergeSkippable(event.target.checked)}
            />
            Merge skippable waves into next wave
          </label>
          <label className="mb-2 flex w-fit items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={hideEarlyWaves}
              onChange={(event) => setHideEarlyWaves(event.target.checked)}
            />
            Hide waves 1-55 (except dangerous floors)
          </label>
        </div>
        <div className="w-1/3 gap-2  flex flex-col text-slate-300">
          <strong>Legend:</strong>
          {Object.values(REMINDER_NOTES).map(({ emoji, label }) => (
            <span key={label} className="flex items-center text-sm gap-1.5">
              <span className="text-2xl leading-none">{emoji}</span>
              {label}
            </span>
          ))}
        </div>
        <div className="w-1/3 flex flex-col gap-2 text-slate-300">
          <strong>Current MVP:</strong>
          <p className="flex flex-col items-center gap-1">
            <img
              src={MONSTER_IMAGE_URL.replace('PLACEHOLDER_TEXT', `${mvpPoolDisplay.monsterId}`)}
              alt={mvpPoolDisplay.monsterName}
              className="w-40 h-auto"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span>{mvpPoolDisplay.monsterName}</span>
            <span>ID: {mvpPoolDisplay.monsterId}</span>
          </p>
        </div>
      </div>
      <Table
        headers={[
          'Wave',
          'Mobs',
          'MVPs',
          <div key="notes-header" className="w-full text-center">
            Notes
          </div>,
        ]}
        enableVirtualization
        virtualColumnWeights={[0.5, 3, 2, 1]}
        virtualRowHeight={30}
        virtualTableHeight={2000}
        compact
        rowClassNames={['px-3', '', 'text-center']}
        rowBackgroundClassNames={filteredWaves.map((wave) =>
          wave.remindersSetup.includes('isMvpFloor') ? MVP_FLOOR_ROW_CLASS : ''
        )}
        rows={filteredWaves.map((wave) => {
          const monstersToRender = onlyShowMvps ? getMvpOnlyMonsters(wave) : wave.monsters;
          const waveNotes = getWaveNotes(wave);
          const mobsToRender =
            monstersToRender === 'GENERIC'
              ? 'GENERIC'
              : monstersToRender.filter((monster) => !monster.isMvp);
          const mvpsToRender =
            monstersToRender === 'GENERIC'
              ? []
              : monstersToRender.filter((monster) => monster.isMvp);

          const renderMonsters = (monsters: typeof mvpsToRender | 'GENERIC') => {
            if (monsters === 'GENERIC') {
              return <span>Mobs</span>;
            }

            return (
              <div className="flex flex-wrap items-center gap-x-9 gap-y-1">
                {monsters.map((monster, monsterIndex) => (
                  <span
                    key={`${monster.monsterId ?? 'na'}-${monsterIndex}`}
                    className="flex items-center gap-2.5"
                  >
                    {monster.monsterId && (
                      <Tooltip
                        content={
                          <img
                            src={MONSTER_IMAGE_URL.replace(
                              'PLACEHOLDER_TEXT',
                              `${monster.monsterId}`
                            )}
                            alt={monster.monsterName}
                            className="w-auto h-auto"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        }
                        placement={TOOLTIP_POSITION.BOTTOM}
                        className="mx-auto"
                      >
                        <img
                          src={MONSTER_IMAGE_URL.replace(
                            'PLACEHOLDER_TEXT',
                            `${monster.monsterId}`
                          )}
                          alt={monster.monsterName}
                          className="h-6 w-6"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </Tooltip>
                    )}
                    {getMonsterName(monster.monsterName, monster.isMvp)}
                  </span>
                ))}
              </div>
            );
          };

          let randomMvp = null;
          if (wave.randomPool) {
            randomMvp = renderMonsters([
              wave.randomPool[getCurrentEntryIndex(wave.randomPool.length)],
            ]);
          }

          return [
            wave.wave,
            renderMonsters(mobsToRender),
            randomMvp ? randomMvp : renderMonsters(mvpsToRender),
            waveNotes.length > 0 ? (
              <div className="flex items-center justify-center gap-1.5">
                {waveNotes.map((note, noteIndex) => (
                  <Tooltip
                    key={`${note.label}-${noteIndex}`}
                    content={note.label}
                    placement={TOOLTIP_POSITION.BOTTOM}
                  >
                    <span className="text-2xl leading-none">{note.emoji}</span>
                  </Tooltip>
                ))}
              </div>
            ) : null,
          ];
        })}
        className="w-full"
      />
    </div>
  );
};

/**
 * Bastion guide page — displays the Bastion instance monster waves alongside a meteor timer.
 *
 * Handles two responsibilities:
 *
 * 1. **Wave/monster table** — {@link BastionWaveTable} reads shared data from
 *    {@link BastionMobsProvider} and renders it as a virtualised {@link Table}.
 *
 * 2. **Viewport fitting** — the outer grid measures its own top offset and the site
 *    footer's height on mount/resize so its content fills the remaining viewport
 *    space above the footer, matching the `fitViewport` behaviour used by {@link Table}.
 *
 */
export const BastionGuide = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState<number>();

  useEffect(() => {
    const updateHeight = () => {
      if (!wrapperRef.current) {
        return;
      }

      const bounds = wrapperRef.current.getBoundingClientRect();
      const footerHeight = getElementHeight(document.querySelector('footer'));

      const nextHeight = calculateViewportHeight(
        bounds,
        0,
        footerHeight,
        0,
        0,
        VIEWPORT_BOTTOM_GAP,
        VIEWPORT_SAFETY_BUFFER,
        MIN_SECTION_HEIGHT,
        Number.MAX_SAFE_INTEGER
      );

      setSectionHeight(nextHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[5fr_5fr]"
      style={sectionHeight ? { height: `${sectionHeight}px` } : undefined}
    >
      <section aria-label="Bastion guide content" className="h-full overflow-hidden">
        <BastionMobsProvider>
          <BastionWaveTable />
        </BastionMobsProvider>
      </section>
      <section className="h-full overflow-hidden">
        <iframe
          title="Meteor timer"
          src="/meteor_timer.html"
          className="block h-full w-full border-0"
        />
      </section>
    </div>
  );
};

export default BastionGuide;
