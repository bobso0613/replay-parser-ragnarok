import Table from '@/components/Table';
import SectionLoading from '@/components/SectionLoading';
import ErrorDetails from '@/components/ErrorDetails';
import { BastionMobsProvider, useBastionMobs } from '@/contexts/BastionMobsContext';
import { useEffect, useRef, useState } from 'react';
import { calculateViewportHeight, getElementHeight } from '@/utils/table-utils';
import { MONSTER_IMAGE_URL, TOOLTIP_POSITION } from '@/constants/index.ts';
import Tooltip from '@/components/Tooltip';
import { getMonsterName } from '@/utils';

const VIEWPORT_BOTTOM_GAP = 24;
const VIEWPORT_SAFETY_BUFFER = 12;
const MIN_SECTION_HEIGHT = 320;

/**
 * Bastion wave/monster table, backed by {@link useBastionMobs}.
 *
 * Renders one of three states depending on the shared fetch:
 *
 * 1. **Loading** — {@link SectionLoading} is shown while `bastion_mobs.json` is being fetched.
 * 2. **Error** — {@link ErrorDetails} is shown with a retry button wired to `reload`.
 * 3. **Loaded** — a virtualised {@link Table} lists every wave with its monsters shown horizontally.
 */
const BastionWaveTable = () => {
  const { waves, isLoading, hasError, reload } = useBastionMobs();

  if (isLoading) {
    return <SectionLoading label="Loading waves..." />;
  }

  if (hasError) {
    return <ErrorDetails retryOnClick={reload} />;
  }

  return (
    <Table
      headers={['Wave', 'Monster']}
      enableVirtualization
      virtualColumnWeights={[0.5, 4]}
      virtualRowHeight={30}
      virtualTableHeight={2000}
      compact
      rowClassNames={['px-3', '']}
      rows={waves.map((wave) => [
        wave.wave,
        <div key={wave.wave} className="flex flex-wrap items-center gap-9">
          {wave.monsters.map((monster) => (
            <span key={monster.monsterId} className="flex items-center gap-2.5">
              {monster.monsterId && (
                <Tooltip
                  content={
                    <img
                      src={MONSTER_IMAGE_URL.replace('PLACEHOLDER_TEXT', `${monster.monsterId}`)}
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
                    src={MONSTER_IMAGE_URL.replace('PLACEHOLDER_TEXT', `${monster.monsterId}`)}
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
        </div>,
      ])}
      className="w-full"
    />
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
