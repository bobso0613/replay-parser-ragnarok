import React from 'react';

type TableProps = {
  headers?: string[] | Array<React.ReactNode>;
  rows: Array<Array<React.ReactNode>>;
  className?: string;
};

const Table: React.FC<TableProps> = ({ headers = [], rows, className = '' }) => {
  const maxCols = Math.max(headers.length, ...rows.map((row) => row.length), 0);

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-slate-200/50 shadow-sm ${className} my-5`}
    >
      <table className="min-w-full divide-y divide-slate-200/50">
        {headers.length > 0 && (
          <thead className="">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap px-4 py-3 text-left font-bold uppercase tracking-wide text-slate-200"
                >
                  {header}
                </th>
              ))}
              {Array.from({ length: Math.max(0, maxCols - headers.length) }).map((_, index) => (
                <th key={`empty-${index}`} className="px-4 py-3" />
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-50/50">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-slate-50 hover:bg-slate-50/20">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {cell}
                </td>
              ))}
              {Array.from({ length: maxCols - row.length }).map((_, index) => (
                <td key={`pad-${index}`} className="px-4 py-3" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Table);
