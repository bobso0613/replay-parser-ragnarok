import { JOB_IMAGE_URL, SKILL_IMAGE_URL, TEXT_IMAGE_VARIANTS, TOOLTIP_POSITION } from '@/constants';
import type { TextImageProps } from '@/types';
import React from 'react';
import Tooltip from './Tooltip';

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
  };

  return (
    <div className="flex gap-1.5 items-center" key={keyId}>
      {textBefore ?? null}
      <Tooltip content={title ?? keyInfo} placement={TOOLTIP_POSITION.BOTTOM}>
        <img
          src={`${skillUrl[variant || 'skill']}`}
          alt={keyInfo}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </Tooltip>
      <span>{keyInfo}</span>
    </div>
  );
};

export default TextImage;
