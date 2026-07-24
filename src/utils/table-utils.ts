import React from 'react';

/**
 * Extract all text content from a React node recursively
 */
export const extractAllText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!React.isValidElement(node)) return '';
  const props = node.props as { children?: React.ReactNode };
  if (Array.isArray(props.children)) return props.children.map(extractAllText).join('');
  return extractAllText(props.children);
};

/**
 * Extract text from a node that matches a target class name
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
 * Extract sort value from a cell using various strategies
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
 * Compare two values for sorting, handling both numeric and string comparisons
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
 * Get the next sort direction (asc -> desc -> asc)
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
 * Get CSS properties for explicit column width
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
 * Parse a CSS pixel value string to a number
 */
export const parseCssPx = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Calculate the virtualized column widths based on weights
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
 * Calculate the available viewport height for virtualized table
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
 * Get bounding rect height safely (returns 0 if element doesn't exist)
 */
export const getElementHeight = (element: HTMLElement | null): number => {
  return Math.ceil(element?.getBoundingClientRect().height ?? 0);
};

/**
 * Get border and padding heights from computed styles
 */
export const getWrapperChromeHeight = (element: HTMLElement): number => {
  const style = window.getComputedStyle(element);
  return parseCssPx(style.borderTopWidth) + parseCssPx(style.borderBottomWidth);
};

/**
 * Get margin bottom from computed styles
 */
export const getWrapperMarginBottom = (element: HTMLElement): number => {
  const style = window.getComputedStyle(element);
  return parseCssPx(style.marginBottom);
};
