import type { SectionLoadingProps } from '@/types';
import React from 'react';
import Spinner from './Spinner';

const SectionLoading: React.FC<SectionLoadingProps> = ({
  size = 40,
  className = '',
  label = 'Loading...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`section-loading flex items-center justify-center gap-3 ${className} rounded-2xl p-12 min-h-60`}
    >
      <Spinner size={size} />

      <span className="text-center text-3xl font-semibold animate-pulse text-gray-600">
        {label}
      </span>
    </div>
  );
};

export default React.memo(SectionLoading);
