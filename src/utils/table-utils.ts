import React from 'react';

/**
 * Recursively walks a React node tree and concatenates all string/number leaf
 * values into a single string.
 *
 * Useful for extracting sortable plain-text from complex JSX cell content.
 *
 * @param node - Any React node (string, number, element, fragment, array, etc.).
 * @returns The concatenated text content of all leaf nodes.
 */
export const extractAllText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!React.isValidElement(node)) return '';
  const props = node.props as { children?: React.ReactNode };
  if (Array.isArray(props.children)) return props.children.map(extractAllText).join('');
  return extractAllText(props.children);
};

/**
 * Walks a React node tree and returns the concatenated text of the first
 * element whose `className` includes `targetClass`.
 *
 * Used by the `Table` component to extract a sort key from a specific
 * child element (e.g. `<span className="sort-value">`).
 *
 * @param node - The root React node to search.
 * @param targetClass - A single CSS class name to match (no dot prefix).
 * @returns The text content of the matching node, or an empty string if not found.
 */
export const extractTextByClassName = (node: React.ReactNode, targetClass: string): string => {
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

/**
 * Resolves a sort value from a table cell using one of three strategies:
 *
 * 1. **Function extractor** – calls `extractor(cellValue)` and returns the result.
 * 2. **String extractor** – treats the string as a CSS class name and returns the
 *    text content of the first matching child element via {@link extractTextByClassName}.
 * 3. **Fallback** – converts the cell value to a string directly.
 *
 * @param cellValue - The raw React node content of the table cell.
 * @param extractor - Optional function or CSS class-name string to customise extraction.
 * @returns A string or number suitable for comparison during sorting.
 */
export const getSortValue = (
  cellValue: React.ReactNode,
  extractor?: ((value: React.ReactNode) => string | number) | string
): string | number => {
  if (typeof extractor === 'function') {
    return extractor(cellValue);
  }

  if (typeof extractor === 'string') {
    return extractTextByClassName(cellValue, extractor);
  }

  return typeof cellValue === 'string' ? cellValue : String(cellValue || '');
};

/**
 * Compares two extracted sort values, preferring numeric comparison when both
 * values parse as finite numbers (commas are stripped before parsing).
 *
 * Falls back to locale-aware string comparison for non-numeric values.
 *
 * @param aExtracted - The sort value of the first row.
 * @param bExtracted - The sort value of the second row.
 * @returns A negative number, zero, or a positive number following the `Array.sort` contract.
 */
export const compareValues = (aExtracted: string | number, bExtracted: string | number): number => {
  const aText = String(aExtracted);
  const bText = String(bExtracted);

  // Try numeric comparison first
  const aNum = parseFloat(aText.replace(/,/g, ''));
  const bNum = parseFloat(bText.replace(/,/g, ''));

  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }

  return aText.localeCompare(bText);
};

/**
 * Determines the next sort direction when a column header is clicked.
 *
 * - Clicking a column that is already sorted ascending flips it to descending.
 * - Clicking a different column (or sorting for the first time) always starts ascending.
 *
 * @param currentColumn - The zero-based index of the currently sorted column, or `null`.
 * @param newColumn - The zero-based index of the column that was just clicked.
 * @param currentDirection - The current sort direction, or `null` if no sort is active.
 * @returns `'asc'` or `'desc'`.
 */
export const getNextSortDirection = (
  currentColumn: number | null,
  newColumn: number,
  currentDirection: 'asc' | 'desc' | null
): 'asc' | 'desc' => {
  if (currentColumn === newColumn && currentDirection === 'asc') {
    return 'desc';
  }

  return 'asc';
};

/**
 * Converts a column-width value to an inline React `CSSProperties` object.
 *
 * - Numbers are converted to `px` strings.
 * - Strings (e.g. `'10%'`, `'auto'`) are used as-is.
 * - `null` / `undefined` returns `undefined` so the browser uses its default width.
 *
 * @param columnWidth - The desired width as a pixel number, a CSS string, `null`, or `undefined`.
 * @returns A `{ width }` style object, or `undefined`.
 */
export const getExplicitColumnWidthStyle = (
  columnWidth: number | string | null | undefined
): React.CSSProperties | undefined => {
  if (columnWidth === null || columnWidth === undefined) {
    return undefined;
  }

  if (typeof columnWidth === 'number') {
    return { width: `${columnWidth}px` };
  }

  return { width: columnWidth };
};

/**
 * Parses a CSS pixel value string (e.g. `'12.5px'`) to a finite number.
 *
 * Returns `0` for non-finite values, including `NaN` and `Infinity`.
 *
 * @param value - A CSS property value string.
 * @returns The numeric pixel value, or `0` if parsing fails.
 */
export const parseCssPx = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Distributes the total list viewport width across `columnCount` columns
 * using the supplied relative weight ratios.
 *
 * Columns without an explicit weight default to a weight of `1`.
 * Integer floor widths are used to avoid sub-pixel rendering artifacts;
 * any leftover pixel from rounding is added to the last column.
 *
 * @param columnCount - Total number of columns.
 * @param listViewportWidth - Available width of the virtualised list container in pixels.
 * @param columnWeights - Optional per-column weight ratios; missing entries default to `1`.
 * @returns An array of integer pixel widths, one per column. Returns `[]` for invalid input.
 */
export const computeColumnWidths = (
  columnCount: number,
  listViewportWidth: number,
  columnWeights?: (number | undefined)[]
): number[] => {
  if (columnCount <= 0 || listViewportWidth <= 0) {
    return [];
  }

  const safeWeights = Array.from({ length: columnCount }).map((_, index) => {
    const weight = Number(columnWeights?.[index] ?? 1);
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
};

/**
 * Calculates the ideal height for a virtualised table container so it fills
 * the remaining viewport without causing the page to scroll.
 *
 * The result is clamped between `minHeight` and `maxHeight`.
 *
 * @param wrapperBounds - Bounding rect of the table's wrapper element.
 * @param headerHeight - Height of the table header row in pixels.
 * @param footerHeight - Height of any footer element below the table in pixels.
 * @param wrapperChromeHeight - Combined border heights of the wrapper (see {@link getWrapperChromeHeight}).
 * @param wrapperMarginBottom - Bottom margin of the wrapper (see {@link getWrapperMarginBottom}).
 * @param viewportBottomGap - Extra gap between the table bottom and the viewport edge (default: 24 px).
 * @param viewportSafetyBuffer - Additional safety buffer subtracted from available height (default: 12 px).
 * @param minHeight - Minimum height in pixels (default: 220 px).
 * @param maxHeight - Maximum height in pixels (default: 520 px).
 * @returns The clamped available height in pixels.
 */
export const calculateViewportHeight = (
  wrapperBounds: DOMRect,
  headerHeight: number,
  footerHeight: number,
  wrapperChromeHeight: number,
  wrapperMarginBottom: number,
  viewportBottomGap: number = 24,
  viewportSafetyBuffer: number = 12,
  minHeight: number = 220,
  maxHeight: number = 520
): number => {
  const availableHeight = Math.floor(
    window.innerHeight -
      wrapperBounds.top -
      viewportBottomGap -
      viewportSafetyBuffer -
      headerHeight -
      footerHeight -
      wrapperChromeHeight -
      wrapperMarginBottom
  );

  return Math.max(minHeight, Math.min(maxHeight, availableHeight));
};

/**
 * Returns the rendered height of a DOM element, rounded up to the nearest pixel.
 *
 * Returns `0` safely when the element is `null`.
 *
 * @param element - The element to measure, or `null`.
 * @returns The element's height in pixels.
 */
export const getElementHeight = (element: HTMLElement | null): number => {
  return Math.ceil(element?.getBoundingClientRect().height ?? 0);
};

/**
 * Returns the sum of an element's top and bottom border widths in pixels.
 *
 * Used to account for wrapper chrome when computing the available table height.
 *
 * @param element - The element whose computed border widths to read.
 * @returns Combined top + bottom border height in pixels.
 */
export const getWrapperChromeHeight = (element: HTMLElement): number => {
  const style = window.getComputedStyle(element);
  return parseCssPx(style.borderTopWidth) + parseCssPx(style.borderBottomWidth);
};

/**
 * Returns the bottom margin of an element in pixels as read from computed styles.
 *
 * @param element - The element whose `marginBottom` to read.
 * @returns The bottom margin in pixels.
 */
export const getWrapperMarginBottom = (element: HTMLElement): number => {
  const style = window.getComputedStyle(element);
  return parseCssPx(style.marginBottom);
};
