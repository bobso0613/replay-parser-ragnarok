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
