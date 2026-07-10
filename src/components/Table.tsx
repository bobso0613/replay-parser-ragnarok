import type { TableProps } from '@/types';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  List,
  useListRef,
  useDynamicRowHeight,
  type DynamicRowHeight,
  type RowComponentProps,
} from 'react-window';

const DEFAULT_VIRTUAL_ROW_HEIGHT = 56;
const DEFAULT_VIRTUAL_TABLE_HEIGHT = 520;
const DEFAULT_VIRTUAL_OVERSCAN = 12;
const MIN_VIRTUAL_TABLE_HEIGHT = 220;
const VIEWPORT_BOTTOM_GAP = 24;
const VIEWPORT_SAFETY_BUFFER = 12;

type VirtualRowProps = {
  rows: Array<Array<React.ReactNode>>;
  rowClassNames: string[];
  maxCols: number;
  columnWidths: number[];
  tableWidth: number;
  dynamicRowHeight: DynamicRowHeight;
};

const VirtualTableRow = ({
  index,
  style,
  rows,
  rowClassNames,
  maxCols,
  columnWidths,
  tableWidth,
  dynamicRowHeight,
  ariaAttributes,
}: RowComponentProps<VirtualRowProps>) => {
  const row = rows[index] ?? [];
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rowElement = rowRef.current;

    if (!rowElement) {
      return () => {};
    }

    const syncHeight = () => {
      const height = Math.ceil(rowElement.getBoundingClientRect().height);
      if (height > 0) {
        dynamicRowHeight.setRowHeight(index, height);
      }
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(() => {
      syncHeight();
    });

    resizeObserver.observe(rowElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [index, dynamicRowHeight, row]);

  return (
    <div ref={rowRef} style={style} {...ariaAttributes}>
      <table
        className="table-fixed border-collapse divide-y divide-slate-200/50"
        style={tableWidth > 0 ? { width: `${tableWidth}px` } : { width: '100%' }}
      >
        <colgroup>
          {Array.from({ length: maxCols }).map((_, colIndex) => (
            <col
              key={colIndex}
              style={columnWidths[colIndex] ? { width: `${columnWidths[colIndex]}px` } : undefined}
            />
          ))}
        </colgroup>
        <tbody>
          <tr className="text-slate-50 hover:bg-slate-50/20">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={`${rowClassNames[cellIndex] ?? ''} px-4 py-3`}>
                {cell}
              </td>
            ))}
            {Array.from({ length: maxCols - row.length }).map((_, padIndex) => (
              <td key={`pad-${padIndex}`} className="px-4 py-3" />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

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
  columnWidths = [],
  sortValues,
  className = '',
  sortableColumns = [],
  sortExtractors = {},
  onSort,
  enableVirtualization = false,
  virtualRowHeight = DEFAULT_VIRTUAL_ROW_HEIGHT,
  virtualTableHeight = DEFAULT_VIRTUAL_TABLE_HEIGHT,
  virtualOverscan = DEFAULT_VIRTUAL_OVERSCAN,
  virtualColumnWeights,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    column: number;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [listViewportWidth, setListViewportWidth] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(virtualTableHeight);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerTableRef = useRef<HTMLTableElement>(null);
  const listRef = useListRef(null);
  const maxCols = Math.max(headers.length, ...rows.map((row) => row.length), 0);
  const hasExplicitColumnWidths = columnWidths.length > 0;
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: virtualRowHeight,
    key: `${maxCols}-${rows.length}-${sortConfig?.column ?? 'none'}-${sortConfig?.direction ?? 'none'}`,
  });

  const getExplicitColumnWidthStyle = (columnIndex: number): React.CSSProperties | undefined => {
    const columnWidth = columnWidths[columnIndex];

    if (columnWidth === null || columnWidth === undefined) {
      return undefined;
    }

    if (typeof columnWidth === 'number') {
      return { width: `${columnWidth}px` };
    }

    return { width: columnWidth };
  };

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

  const shouldVirtualize = enableVirtualization && sortedRows.length > 0;
  const estimatedContentHeight = Math.ceil(
    sortedRows.length * dynamicRowHeight.getAverageRowHeight()
  );
  const virtualizedHeight = Math.max(
    MIN_VIRTUAL_TABLE_HEIGHT,
    Math.min(viewportHeight, estimatedContentHeight)
  );
  const computedColumnWidths = useMemo(() => {
    if (!shouldVirtualize || maxCols <= 0 || listViewportWidth <= 0) {
      return [] as number[];
    }

    const safeWeights = Array.from({ length: maxCols }).map((_, index) => {
      const weight = Number(virtualColumnWeights?.[index] ?? 1);
      return Number.isFinite(weight) && weight > 0 ? weight : 1;
    });
    const totalWeight = safeWeights.reduce((acc, weight) => acc + weight, 0);
    const rawWidths = safeWeights.map((weight) => (listViewportWidth * weight) / totalWeight);
    const flooredWidths = rawWidths.map((width) => Math.floor(width));
    const remainder = Math.max(
      0,
      listViewportWidth - flooredWidths.reduce((acc, width) => acc + width, 0)
    );

    return flooredWidths.map((width, index) =>
      index === flooredWidths.length - 1 ? width + remainder : width
    );
  }, [shouldVirtualize, maxCols, listViewportWidth, virtualColumnWeights]);

  useEffect(() => {
    if (!shouldVirtualize) {
      return () => {};
    }

    const parseCssPx = (value: string): number => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const updateViewportHeight = () => {
      if (!wrapperRef.current) {
        return;
      }

      const bounds = wrapperRef.current.getBoundingClientRect();
      const headerHeight = Math.ceil(headerTableRef.current?.getBoundingClientRect().height ?? 0);
      const footerHeight = Math.ceil(
        document.querySelector('footer')?.getBoundingClientRect().height ?? 0
      );
      const wrapperStyle = window.getComputedStyle(wrapperRef.current);
      const wrapperChromeHeight =
        parseCssPx(wrapperStyle.borderTopWidth) + parseCssPx(wrapperStyle.borderBottomWidth);
      const wrapperMarginBottom = parseCssPx(wrapperStyle.marginBottom);
      const availableHeight = Math.floor(
        window.innerHeight -
          bounds.top -
          VIEWPORT_BOTTOM_GAP -
          VIEWPORT_SAFETY_BUFFER -
          headerHeight -
          footerHeight -
          wrapperChromeHeight -
          wrapperMarginBottom
      );
      const nextHeight = Math.max(
        MIN_VIRTUAL_TABLE_HEIGHT,
        Math.min(virtualTableHeight, availableHeight)
      );

      setViewportHeight(nextHeight);
    };

    updateViewportHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateViewportHeight();
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    window.addEventListener('resize', updateViewportHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, [shouldVirtualize, virtualTableHeight]);

  useEffect(() => {
    if (!shouldVirtualize) {
      return () => {};
    }

    const syncListViewportWidth = () => {
      const nextListViewportWidth =
        listRef.current?.element?.clientWidth ?? wrapperRef.current?.clientWidth ?? 0;

      setListViewportWidth(nextListViewportWidth);
    };

    syncListViewportWidth();

    const resizeObserver = new ResizeObserver(() => {
      syncListViewportWidth();
    });

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    if (listRef.current?.element) {
      resizeObserver.observe(listRef.current.element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [shouldVirtualize, maxCols, listRef]);

  return (
    <div
      ref={wrapperRef}
      className={`overflow-x-auto rounded-lg border border-slate-200/50 shadow-sm ${className} my-5`}
    >
      <table
        ref={headerTableRef}
        className={`${shouldVirtualize || hasExplicitColumnWidths ? 'table-fixed' : ''} ${shouldVirtualize ? 'border-collapse' : ''} divide-y divide-slate-200/50`}
        style={
          shouldVirtualize
            ? listViewportWidth > 0
              ? { width: `${listViewportWidth}px` }
              : { width: '100%' }
            : { minWidth: '100%' }
        }
      >
        {shouldVirtualize && (
          <colgroup>
            {Array.from({ length: maxCols }).map((_, colIndex) => (
              <col
                key={`head-col-${colIndex}`}
                style={
                  computedColumnWidths[colIndex]
                    ? { width: `${computedColumnWidths[colIndex]}px` }
                    : undefined
                }
              />
            ))}
          </colgroup>
        )}
        {!shouldVirtualize && hasExplicitColumnWidths && (
          <colgroup>
            {Array.from({ length: maxCols }).map((_, colIndex) => (
              <col
                key={`head-explicit-col-${colIndex}`}
                style={getExplicitColumnWidthStyle(colIndex)}
              />
            ))}
          </colgroup>
        )}
        {headers.length > 0 && (
          <thead className="">
            <tr>
              {headers.map((header, index) => {
                const isSortable = sortableColumns.includes(index);
                const isSorted = sortConfig?.column === index;
                const hasComplexHeader = React.isValidElement(header);

                return (
                  <th
                    key={index}
                    onClick={() => handleHeaderClick(index)}
                    className={`px-4 py-3 text-left font-bold uppercase tracking-wide text-slate-200 ${
                      hasComplexHeader ? '' : 'whitespace-nowrap '
                    }${isSortable ? 'cursor-pointer hover:bg-slate-50/10' : ''}`}
                  >
                    {isSortable ? (
                      <div className="flex items-center gap-2">
                        {header}
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
                      </div>
                    ) : (
                      header
                    )}
                  </th>
                );
              })}
              {Array.from({ length: Math.max(0, maxCols - headers.length) }).map((_, index) => {
                return <th key={`empty-${index}`} className="px-4 py-3" />;
              })}
            </tr>
          </thead>
        )}
        {!shouldVirtualize && (
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
        )}
      </table>

      {shouldVirtualize && (
        <List
          listRef={listRef}
          rowCount={sortedRows.length}
          rowHeight={dynamicRowHeight}
          rowComponent={VirtualTableRow}
          rowProps={{
            rows: sortedRows,
            rowClassNames,
            maxCols,
            columnWidths: computedColumnWidths,
            tableWidth: listViewportWidth,
            dynamicRowHeight,
          }}
          overscanCount={virtualOverscan}
          style={{ height: virtualizedHeight, width: '100%' }}
          className="divide-y divide-slate-50/50"
        />
      )}
    </div>
  );
};

export default React.memo(Table);
