/** Environment variable bundle for the application. */
export const ENV = {
  APPLICATION_NAME: import.meta.env.VITE_APPLICATION_NAME,
};

/** Base URL template for skill icon images; replace `PLACEHOLDER_TEXT` with the skill ID. */
export const SKILL_IMAGE_URL = import.meta.env.VITE_SKILL_IMAGE_URL;
/** Base URL template for job sprite images; replace `PLACEHOLDER_TEXT` with the job ID. */
export const JOB_IMAGE_URL = import.meta.env.VITE_JOB_IMAGE_URL;
/** Base URL template for monster images; replace `PLACEHOLDER_TEXT` with the monster ID. */
export const MONSTER_IMAGE_URL = import.meta.env.VITE_MONSTER_IMAGE_URL;
/** Base URL template for item images; replace `PLACEHOLDER_TEXT` with the item ID. */
export const ITEM_IMAGE_URL = import.meta.env.VITE_ITEM_IMAGE_URL;
/** API endpoint for uploading and parsing replay files. */
export const PARSER_URL = import.meta.env.VITE_PARSER_URL;
/** Base URL for shared replay links. */
export const REPLAY_URL_SHARE = import.meta.env.VITE_REPLAY_URL_SHARE;
/** Router base path; defaults to `/` when the env var is not set. */
export const BASE_PATH = import.meta.env.VITE_BASE_PATH || '/';
/** Variant identifiers for the TextImage component. */
export const TEXT_IMAGE_VARIANTS = {
  SKILL: 'skill',
  JOB: 'job',
  ITEM: 'item',
};

/** Valid placement values for the Tooltip component. */
export const TOOLTIP_POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
};
