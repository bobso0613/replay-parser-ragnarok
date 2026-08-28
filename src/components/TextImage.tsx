import {
  ITEM_IMAGE_URL,
  JOB_IMAGE_URL,
  SKILL_IMAGE_URL,
  TEXT_IMAGE_VARIANTS,
  TOOLTIP_POSITION,
} from '@/constants/index.ts';
import type { TextImageProps } from '@/types';
import React from 'react';
import Tooltip from './Tooltip';

/**
 * Renders a small icon image alongside a text label, with a {@link Tooltip}
 * on hover.
 *
 * The image URL is built from the `SKILL_IMAGE_URL` or `JOB_IMAGE_URL`
 * environment constants by replacing the `PLACEHOLDER_TEXT` token with
 * `keyId`. The image is lazy-loaded to avoid blocking above-the-fold content.
 *
 * @param props - {@link TextImageProps}
 */
const TextImage: React.FC<TextImageProps> = ({
  keyId,
  variant = TEXT_IMAGE_VARIANTS.SKILL,
  keyInfo,
  textBefore,
  title,
}) => {
  const skillUrl: Record<string, string> = {
    skill: SKILL_IMAGE_URL.replace('PLACEHOLDER_TEXT', keyId.toString()),
    job: JOB_IMAGE_URL.replace('PLACEHOLDER_TEXT', keyId.toString()),
    item: ITEM_IMAGE_URL.replace('PLACEHOLDER_TEXT', keyId.toString()),
  };

  return (
    <div className="flex gap-1.5 items-center" key={keyId}>
      {textBefore ?? null}
      <div className="w-6.25 h-6.25">
        <Tooltip
          content={title ?? keyInfo}
          placement={TOOLTIP_POSITION.BOTTOM}
          className="w-6.25 h-6.25"
        >
          <img
            src={`${skillUrl[variant || 'skill']}`}
            alt={keyInfo}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-6.25 h-6.25"
          />
        </Tooltip>
      </div>
      <span className="sort-value">{keyInfo}</span>
    </div>
  );
};

export default TextImage;
