export const removeAllFileExtensions = (filename: string) => filename.replace(/(\.[^/.]+)+$/, '');
export * from './parse-replay-json';
