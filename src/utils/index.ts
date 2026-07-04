export const removeAllFileExtensions = (filename: string) => filename.replace(/(\.[^/.]+)+$/, '');
export * from './parse-replay-json';

export const getMonsterName = (name: string, isMvp: boolean) => `${name} ${isMvp ? '(MVP)' : ''}`;
