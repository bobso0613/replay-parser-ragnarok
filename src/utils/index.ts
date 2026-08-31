import { FIRST_ENTRY_DATE, MILLISECONDS_PER_WEEK } from '@/constants';
import type { BastionMonster, BastionWave } from '@/types';

/**
 * Strips all file extensions from a filename.
 *
 * Handles multi-part extensions such as `.min.js` or `.test.tsx` by
 * repeatedly removing the rightmost extension segment.
 *
 * @param filename - The filename string to process (path separators are preserved).
 * @returns The filename with every extension removed.
 *
 * @example
 * removeAllFileExtensions('replay.grf')       // 'replay'
 * removeAllFileExtensions('script.min.js')    // 'script'
 * removeAllFileExtensions('no-extension')     // 'no-extension'
 */
export const removeAllFileExtensions = (filename: string) => filename.replace(/(\.[^/.]+)+$/, '');
export * from './parse-replay-json';

/**
 * Formats a monster's display name, appending `(MVP)` when the monster is an MVP.
 *
 * @param name - The base monster name as stored in the mob database.
 * @param isMvp - Pass `true` for MVP monsters to append the `(MVP)` suffix.
 * @returns The formatted display name (e.g. `'Baphomet (MVP)'` or `'Poring '`).
 */
export const getMonsterName = (name: string, isMvp: boolean) => `${name} ${isMvp ? '(MVP)' : ''}`;

/**
 * Folds monsters from consecutive skippable waves into the next non-skippable wave.
 *
 * Waves with `isSkippable: true` are dropped, and their monsters are prepended
 * to the following non-skippable wave's monster list. Trailing skippable waves
 * (with no later non-skippable wave) are folded into the last kept wave instead.
 *
 * @param waves - Waves to merge, in wave-number order.
 * @returns A new array of waves with skippable waves folded into the next kept wave.
 */
export const mergeSkippableWaves = (waves: BastionWave[]) => {
  const merged: BastionWave[] = [];
  let pendingMonsters: BastionMonster[] = [];

  waves.forEach((wave) => {
    if (wave.isSkippable) {
      pendingMonsters = [...pendingMonsters, ...wave.monsters];
      return;
    }

    merged.push({ ...wave, monsters: [...pendingMonsters, ...wave.monsters] });
    pendingMonsters = [];
  });

  if (pendingMonsters.length > 0 && merged.length > 0) {
    const lastWave = merged[merged.length - 1];
    merged[merged.length - 1] = {
      ...lastWave,
      monsters: [...lastWave.monsters, ...pendingMonsters],
    };
  }

  return merged;
};

/**
 * Filters out waves numbered 1-55, unless they carry the `isDangerousFloor` reminder.
 *
 * @param waves - Waves to filter.
 * @returns Waves numbered above 55, plus any wave flagged `isDangerousFloor` regardless of number.
 */
export const hideNonDangerousEarlyWaves = (waves: BastionWave[]) =>
  waves.filter((wave) => wave.wave > 55 || wave.remindersSetup.includes('isDangerousFloor'));

/**
 * Keeps only waves flagged `isDangerousFloor`.
 *
 * @param waves - Waves to filter.
 * @returns Waves that carry the `isDangerousFloor` reminder.
 */
export const showOnlyDangerousFloorWaves = (waves: BastionWave[]) =>
  waves.filter((wave) => wave.remindersSetup.includes('isDangerousFloor'));

/**
 * Reduces a wave's monster list for the "only show MVPs" view.
 *
 * Waves flagged `isDangerousFloor` are exempt and return their full monster list
 * unchanged. Non-dangerous waves resolve to their MVP monsters only, or to the
 * string `'GENERIC'` when the wave has monsters but none are MVPs, signalling
 * that a single generic "Mobs" label should be shown instead of names/images.
 *
 * @param wave - The wave to reduce.
 * @returns MVP monsters, the full monster list (dangerous floors), or `'GENERIC'`.
 */
export const getMvpOnlyMonsters = (wave: BastionWave): BastionMonster[] | 'GENERIC' => {
  if (wave.remindersSetup.includes('isDangerousFloor')) {
    return wave.monsters;
  }

  const mvpMonsters = wave.monsters.filter((monster) => monster.isMvp);

  if (mvpMonsters.length > 0) {
    return mvpMonsters;
  }

  return wave.monsters.length > 0 ? 'GENERIC' : [];
};

/** Maps each reminder flag to the emoji and legend label shown in the wave table. */
export const REMINDER_NOTES: Record<
  BastionWave['remindersSetup'][number],
  { emoji: string; label: string }
> = {
  isDangerousFloor: { emoji: '⚠️', label: 'Dangerous floor' },
  isMvpFloor: { emoji: '👺', label: 'MVP floor' },
  restockFlag: { emoji: '📦', label: 'Restock' },
  isStartOfStatus: { emoji: '👽', label: 'Status effect starts' },
  isStartOfMeteor: { emoji: '🌠', label: 'Meteor starts' },
  isStashDisappear: { emoji: '🛸', label: 'Stash disappears' },
};

/**
 * Builds the reminder notes for a wave, each with its emoji and label.
 *
 * @param wave - The wave to build notes for.
 * @returns The wave's reminder notes, one per matching flag in `remindersSetup`.
 */
export const getWaveNotes = (wave: BastionWave) =>
  wave.remindersSetup
    .map((reminder) => REMINDER_NOTES[reminder])
    .filter((note): note is { emoji: string; label: string } => Boolean(note));

/** * Gets the current entry index based on a weekly rotation schedule.
 * The first entry starts on August 24, 2026 at 06:00 GMT.
 * The active entry changes every Monday at 06:00 GMT and
 * automatically resets to the first entry after the last entry.
 * @param entryCount - Total number of entries in the rotation.
 * @param now - Date/time to evaluate. Defaults to the current date/time.
 * @returns The zero-based index of the currently active entry.
 * @example
 * // August 24, 2026 06:00 GMT
 * getCurrentEntryIndex(12, new Date("2026-08-24T06:00:00Z"));
 * // Returns 0
 * @example
 * // August 31, 2026 06:00 GMT
 * getCurrentEntryIndex(12, new Date("2026-08-31T06:00:00Z"));
 * // Returns 1
 * @example
 * // November 16, 2026 06:00 GMT
 * // After all 12 entries have been shown
 * getCurrentEntryIndex(12, new Date("2026-11-16T06:00:00Z"));
 * // Returns 0 */
export const getCurrentEntryIndex = (entryCount: number, now: Date = new Date()): number => {
  const millisecondsElapsed = now.getTime() - FIRST_ENTRY_DATE.getTime();
  const weeksElapsed = Math.floor(millisecondsElapsed / MILLISECONDS_PER_WEEK);
  return ((weeksElapsed % entryCount) + entryCount) % entryCount;
};
