import type { TableProps } from '@/types';
import React, { useState, useMemo } from 'react';

const extractAllText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!React.isValidElement(node)) return '';
  const props = node.props as { children?: React.ReactNode };
  if (Array.isArray(props.children)) return props.children.map(extractAllText).join('');
  return extractAllText(props.children);
};

const extractTextByClassName = (node: React.ReactNode, targetClass: string): string => {
  if (!React.isValidElement(node)) return '';
  const props = node.props as { className?: string; children?: React.ReactNode };

  if (props.className?.split(' ').includes(targetClass)) {
    return extractAllText(props.children);
  }

  if (Array.isArray(props.children)) {
    for (const child of props.children) {
      const result = extractTextByClassName(child, targetClass);
      if (result) return result;
    }
  } else if (props.children) {
    return extractTextByClassName(props.children, targetClass);
  }

  return '';
};

const Table: React.FC<TableProps> = ({
  headers = [],
  rowClassNames = [],
  rows,
  sortValues,
  className = '',
  sortableColumns = [],
  sortExtractors = {},
  onSort,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    column: number;
    direction: 'asc' | 'desc';
  } | null>(null);
  const maxCols = Math.max(headers.length, ...rows.map((row) => row.length), 0);

  const handleHeaderClick = (columnIndex: number) => {
    if (!sortableColumns.includes(columnIndex)) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortConfig?.column === columnIndex && sortConfig.direction === 'asc') {
      newDirection = 'desc';
    }

    setSortConfig({ column: columnIndex, direction: newDirection });
    onSort?.(columnIndex, newDirection);
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    const { column, direction } = sortConfig;
    const indexed = rows.map((row, i) => ({ row, i }));
    const sorted = [...indexed].sort((a, b) => {
      const aVal = a.row[column];
      const bVal = b.row[column];

      // Use custom extractor if provided
      let aExtracted: string | number;
      let bExtracted: string | number;

      const extractor = sortExtractors[column];

      if (sortValues) {
        aExtracted = sortValues[a.i]?.[column] ?? '';
        bExtracted = sortValues[b.i]?.[column] ?? '';
      } else if (typeof extractor === 'function') {
        aExtracted = extractor(aVal);
        bExtracted = extractor(bVal);
      } else if (typeof extractor === 'string') {
        aExtracted = extractTextByClassName(aVal, extractor);
        bExtracted = extractTextByClassName(bVal, extractor);
      } else {
        aExtracted = typeof aVal === 'string' ? aVal : String(aVal || '');
        bExtracted = typeof bVal === 'string' ? bVal : String(bVal || '');
      }

      const aText = String(aExtracted);
      const bText = String(bExtracted);

      // Try numeric comparison first
      const aNum = parseFloat(aText.replace(/,/g, ''));
      const bNum = parseFloat(bText.replace(/,/g, ''));

      let comparison = 0;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        comparison = aText.localeCompare(bText);
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted.map(({ row }) => row);
  }, [sortConfig, rows, sortValues, sortExtractors]);

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-slate-200/50 shadow-sm ${className} my-5`}
    >
      <table className="min-w-full divide-y divide-slate-200/50">
        {headers.length > 0 && (
          <thead className="">
            <tr>
              {headers.map((header, index) => {
                const isSortable = sortableColumns.includes(index);
                const isSorted = sortConfig?.column === index;

                return (
                  <th
                    key={index}
                    onClick={() => handleHeaderClick(index)}
                    className={`whitespace-nowrap px-4 py-3 text-left font-bold uppercase tracking-wide text-slate-200 ${
                      isSortable ? 'cursor-pointer hover:bg-slate-50/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {isSortable && (
                        <span className="text-2xl">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              '↑'
                            ) : (
                              '↓'
                            )
                          ) : (
                            <span className="opacity-30">⇅</span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {Array.from({ length: Math.max(0, maxCols - headers.length) }).map((_, index) => (
                <th key={`empty-${index}`} className="px-4 py-3" />
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-50/50">
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={maxCols} className="px-4 py-8 text-center text-slate-400">
                No records found
              </td>
            </tr>
          ) : (
            sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className={`text-slate-50 hover:bg-slate-50/20`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={`${rowClassNames[cellIndex] ?? ''} px-4 py-3`}>
                    {cell}
                  </td>
                ))}
                {Array.from({ length: maxCols - row.length }).map((_, index) => (
                  <td key={`pad-${index}`} className="px-4 py-3" />
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Table);
