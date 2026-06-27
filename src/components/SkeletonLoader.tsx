import type { SkeletonLoaderProps } from '@/types';
import React, { memo } from 'react';
import Table from './Table';

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5, columns = 4 }) => {
  const headers = Array.from({ length: columns }, (_, index) => (
    <div key={index} className="h-5 rounded-md bg-slate-700 animate-pulse" />
  ));

  const bodyRows = Array.from({ length: rows }, (_, rowIndex) => {
    const rowsList: Array<React.ReactNode> = Array.from({ length: columns }, (_, cellIndex) => (
      <div
        key={`row-${rowIndex}-${cellIndex}`}
        className="h-5 rounded-md bg-slate-500 animate-pulse"
      />
    ));

    return rowsList;
  });

  return (
    <>
      <div className="h-10 max-w-xs w-7xl my-3.5 rounded-md bg-slate-700 animate-pulse" />
      <div className="h-5 max-w-xs rounded-md my-3.5 bg-slate-700 animate-pulse" />

      <Table rows={bodyRows} headers={headers} />
    </>
  );
};

export default memo(SkeletonLoader);
