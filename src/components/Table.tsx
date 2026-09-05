import type { TableProps } from '@/types';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  List,
  useListRef,
  useDynamicRowHeight,
  type DynamicRowHeight,
  type RowComponentProps,
} from 'react-window';
import {
  extractTextByClassName,
  compareValues,
  getNextSortDirection,
  computeColumnWidths,
  calculateViewportHeight,
  getElementHeight,
  getWrapperChromeHeight,
  getWrapperMarginBottom,
} from '@/utils/table-utils';

const DEFAULT_VIRTUAL_ROW_HEIGHT = 56;
const DEFAULT_VIRTUAL_TABLE_HEIGHT = 520;
const DEFAULT_VIRTUAL_OVERSCAN = 12;
const MIN_VIRTUAL_TABLE_HEIGHT = 220;
const VIEWPORT_BOTTOM_GAP = 24;
const VIEWPORT_SAFETY_BUFFER = 12;

type VirtualRowProps = {
  rows: Array<Array<React.ReactNode>>;
  rowClassNames: string[];
  rowBackgroundClassNames?: string[];
  maxCols: number;
  columnWidths: number[];
  tableWidth: number;
  dynamicRowHeight: DynamicRowHeight;
  compact: boolean;
};

/** Renders a single virtualised row inside the react-window `List`, syncing
 * its measured height back to the dynamic-row-height registry via a
 * `ResizeObserver` so that variable-height rows are handled correctly. */
const VirtualTableRow = ({
  index,
  style,
  rows,
  rowClassNames,
  rowBackgroundClassNames,
  maxCols,
  columnWidths,
  tableWidth,
  dynamicRowHeight,
  compact,
  ariaAttributes,
}: RowComponentProps<VirtualRowProps>) => {
  const row = rows[index] ?? [];
  const rowRef = useRef<HTMLDivElement>(null);
  const cellPadding = compact ? 'px-1 py-1' : 'px-4 py-3';

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
          <tr
            className={`text-slate-50 hover:bg-slate-50/20 ${rowBackgroundClassNames?.[index] ?? ''}`}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={`${rowClassNames[cellIndex] ?? ''} ${cellPadding}`}>
                {cell}
              </td>
            ))}
            {Array.from({ length: maxCols - row.length }).map((_, padIndex) => (
              <td key={`pad-${padIndex}`} className={cellPadding} />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

/**
 * Sortable data table with optional react-window virtualisation for large datasets.
 *
 * **Sorting** is handled entirely within this component when `sortableColumns`
 * is provided. Clicking a sortable column header cycles through `asc → desc → asc`.
 * An `onSort` callback can be supplied for external sort state management.
 *
 * **Virtualisation** is activated by `enableVirtualization`. When enabled,
 * `react-window` renders only the visible rows plus `virtualOverscan` rows
 * above and below the viewport. Column widths are distributed by
 * `virtualColumnWeights` ratios and the table height auto-fits to the remaining
 * viewport space.
 *
 * **Column widths** can be set explicitly via `columnWidths` (non-virtual mode)
 * or via weight ratios via `virtualColumnWeights` (virtual mode).
 *
 * **Compact mode** (`compact`) reduces cell padding from `px-4 py-3` to `px-1 py-1`.
 *
 * **Row backgrounds** (`rowBackgroundClassNames`) apply a CSS class to each `<tr>`,
 * parallel to `rows`, so a whole row's background can be styled regardless of
 * individual cells' content width.
 *
 * @param props - {@link TableProps}
 */
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
  fitViewport = true,
  virtualOverscan = DEFAULT_VIRTUAL_OVERSCAN,
  virtualColumnWeights,
  compact = false,
  rowBackgroundClassNames,
}) => {
  const cellPadding = compact ? 'px-1 py-1' : 'px-4 py-3';
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

    const newDirection = getNextSortDirection(
      sortConfig?.column ?? null,
      columnIndex,
      sortConfig?.direction ?? null
    );

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

      const extractor = sortExtractors[column];

      let aExtracted: string | number;
      let bExtracted: string | number;

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

      const comparison = compareValues(aExtracted, bExtracted);
      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted.map(({ row }) => row);
  }, [sortConfig, rows, sortValues, sortExtractors]);

  const shouldVirtualize = enableVirtualization && sortedRows.length > 0;
  const estimatedContentHeight = Math.ceil(
    sortedRows.length * dynamicRowHeight.getAverageRowHeight()
  );
  const virtualizedHeight = Math.min(viewportHeight, estimatedContentHeight);
  const computedColumnWidths = useMemo(() => {
    if (!shouldVirtualize || maxCols <= 0 || listViewportWidth <= 0) {
      return [] as number[];
    }

    return computeColumnWidths(maxCols, listViewportWidth, virtualColumnWeights);
  }, [shouldVirtualize, maxCols, listViewportWidth, virtualColumnWeights]);

  useEffect(() => {
    if (!shouldVirtualize || !fitViewport) {
      return () => {};
    }

    const updateViewportHeight = () => {
      if (!wrapperRef.current) {
        return;
      }

      const bounds = wrapperRef.current.getBoundingClientRect();
      const headerHeight = getElementHeight(headerTableRef.current);
      const footerHeight = getElementHeight(document.querySelector('footer'));
      const wrapperChromeHeight = getWrapperChromeHeight(wrapperRef.current);
      const wrapperMarginBottom = getWrapperMarginBottom(wrapperRef.current);

      const nextHeight = calculateViewportHeight(
        bounds,
        headerHeight,
        footerHeight,
        wrapperChromeHeight,
        wrapperMarginBottom,
        VIEWPORT_BOTTOM_GAP,
        VIEWPORT_SAFETY_BUFFER,
        MIN_VIRTUAL_TABLE_HEIGHT,
        virtualTableHeight
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
  }, [shouldVirtualize, fitViewport, virtualTableHeight]);

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
      className={`overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200/50 shadow-sm ${className} my-5`}
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
                    className={`${cellPadding} text-left font-bold uppercase tracking-wide text-slate-200 ${
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
                return <th key={`empty-${index}`} className={cellPadding} />;
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
                <tr
                  key={rowIndex}
                  className={`text-slate-50 hover:bg-slate-50/20 ${rowBackgroundClassNames?.[rowIndex] ?? ''}`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`${rowClassNames[cellIndex] ?? ''} ${cellPadding}`}
                    >
                      {cell}
                    </td>
                  ))}
                  {Array.from({ length: maxCols - row.length }).map((_, index) => (
                    <td key={`pad-${index}`} className={cellPadding} />
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
            rowBackgroundClassNames,
            maxCols,
            columnWidths: computedColumnWidths,
            tableWidth: listViewportWidth,
            dynamicRowHeight,
            compact,
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
