import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import {
  extractAllText,
  extractTextByClassName,
  getSortValue,
  compareValues,
  getNextSortDirection,
  getExplicitColumnWidthStyle,
  parseCssPx,
  computeColumnWidths,
  calculateViewportHeight,
  getElementHeight,
  getWrapperChromeHeight,
  getWrapperMarginBottom,
} from './table-utils';

describe('table-utils', () => {
  describe('extractAllText', () => {
    it('should extract text from string node', () => {
      const result = extractAllText('hello');
      expect(result).toBe('hello');
    });

    it('should extract text from number node', () => {
      const result = extractAllText(123);
      expect(result).toBe('123');
    });

    it('should return empty string for non-React node', () => {
      const result = extractAllText(null as any);
      expect(result).toBe('');
    });

    it('should extract text from React element with text children', () => {
      const element = React.createElement('div', {}, 'hello');
      const result = extractAllText(element);
      expect(result).toBe('hello');
    });

    it('should extract text from React element with multiple children', () => {
      const element = React.createElement('div', {}, ['hello', ' ', 'world']);
      const result = extractAllText(element);
      expect(result).toBe('hello world');
    });

    it('should recursively extract text from nested elements', () => {
      const element = React.createElement('div', {}, [
        'start',
        React.createElement('span', {}, 'nested'),
        'end',
      ]);
      const result = extractAllText(element);
      expect(result).toBe('startnestedend');
    });

    it('should handle undefined children', () => {
      const element = React.createElement('div', {}, undefined);
      const result = extractAllText(element);
      expect(result).toBe('');
    });
  });

  describe('extractTextByClassName', () => {
    it('should extract text from element with matching class', () => {
      const element = React.createElement('div', { className: 'my-class other' }, 'content');
      const result = extractTextByClassName(element, 'my-class');
      expect(result).toBe('content');
    });

    it('should return empty string for non-React node', () => {
      const result = extractTextByClassName('string', 'my-class');
      expect(result).toBe('');
    });

    it('should search in children for matching class', () => {
      const element = React.createElement('div', {}, [
        React.createElement('span', { className: 'target' }, 'found'),
      ]);
      const result = extractTextByClassName(element, 'target');
      expect(result).toBe('found');
    });

    it('should return empty string if class not found', () => {
      const element = React.createElement('div', { className: 'other' }, 'content');
      const result = extractTextByClassName(element, 'target');
      expect(result).toBe('');
    });

    it('should traverse nested children array', () => {
      const element = React.createElement('div', {}, [
        'text',
        React.createElement('div', {}, [
          React.createElement('span', { className: 'deep' }, 'nested'),
        ]),
      ]);
      const result = extractTextByClassName(element, 'deep');
      expect(result).toBe('nested');
    });

    it('should handle multiple classes', () => {
      const element = React.createElement('div', { className: 'class1 class2 class3' }, 'data');
      const result = extractTextByClassName(element, 'class2');
      expect(result).toBe('data');
    });

    it('should return first match only', () => {
      const element = React.createElement('div', {}, [
        React.createElement('span', { className: 'target' }, 'first'),
        React.createElement('span', { className: 'target' }, 'second'),
      ]);
      const result = extractTextByClassName(element, 'target');
      expect(result).toBe('first');
    });
  });

  describe('getSortValue', () => {
    it('should return string cell value as-is', () => {
      const result = getSortValue('test');
      expect(result).toBe('test');
    });

    it('should convert non-string cell value to string', () => {
      const result = getSortValue(123);
      expect(result).toBe('123');
    });

    it('should use function extractor if provided', () => {
      const extractor = (val: any) => String(val).toUpperCase();
      const result = getSortValue('hello', extractor);
      expect(result).toBe('HELLO');
    });

    it('should use class name extractor if provided as string', () => {
      const element = React.createElement('div', { className: 'target' }, 'value');
      const result = getSortValue(element, 'target');
      expect(result).toBe('value');
    });

    it('should return empty string if cell value is null or undefined', () => {
      const result = getSortValue(null);
      expect(result).toBe('');
    });
  });

  describe('compareValues', () => {
    it('should compare numbers correctly', () => {
      const result = compareValues(10, 20);
      expect(result).toBeLessThan(0);
    });

    it('should handle numeric strings with commas', () => {
      const result = compareValues('1,000', '2,000');
      expect(result).toBeLessThan(0);
    });

    it('should compare strings lexicographically', () => {
      const result = compareValues('apple', 'banana');
      expect(result).toBeLessThan(0);
    });

    it('should return 0 for equal values', () => {
      const result = compareValues(10, 10);
      expect(result).toBe(0);
    });

    it('should handle mixed string and number comparison', () => {
      // 'text10' should be compared as string since 'text10' is not a valid number
      const result = compareValues('text10', 'text20');
      expect(result).toBeLessThan(0);
    });

    it('should handle NaN case for non-numeric strings', () => {
      const result = compareValues('abc', 'def');
      expect(result).toBeLessThan(0);
    });
  });

  describe('getNextSortDirection', () => {
    it('should return asc for new column', () => {
      const result = getNextSortDirection(null, 1, null);
      expect(result).toBe('asc');
    });

    it('should return asc when switching columns', () => {
      const result = getNextSortDirection(1, 2, 'asc');
      expect(result).toBe('asc');
    });

    it('should return desc when clicking same column with asc', () => {
      const result = getNextSortDirection(1, 1, 'asc');
      expect(result).toBe('desc');
    });

    it('should return asc when clicking same column with desc', () => {
      const result = getNextSortDirection(1, 1, 'desc');
      expect(result).toBe('asc');
    });

    it('should return asc for initial state', () => {
      const result = getNextSortDirection(null, 0, null);
      expect(result).toBe('asc');
    });
  });

  describe('getExplicitColumnWidthStyle', () => {
    it('should return undefined for null', () => {
      const result = getExplicitColumnWidthStyle(null);
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const result = getExplicitColumnWidthStyle(undefined);
      expect(result).toBeUndefined();
    });

    it('should return pixel style for number', () => {
      const result = getExplicitColumnWidthStyle(100);
      expect(result).toEqual({ width: '100px' });
    });

    it('should return style as-is for string', () => {
      const result = getExplicitColumnWidthStyle('50%');
      expect(result).toEqual({ width: '50%' });
    });

    it('should handle CSS calc values', () => {
      const result = getExplicitColumnWidthStyle('calc(100% - 20px)');
      expect(result).toEqual({ width: 'calc(100% - 20px)' });
    });
  });

  describe('parseCssPx', () => {
    it('should parse pixel string', () => {
      const result = parseCssPx('10px');
      expect(result).toBe(10);
    });

    it('should handle decimal values', () => {
      const result = parseCssPx('10.5px');
      expect(result).toBe(10.5);
    });

    it('should return 0 for invalid value', () => {
      const result = parseCssPx('invalid');
      expect(result).toBe(0);
    });

    it('should return 0 for empty string', () => {
      const result = parseCssPx('');
      expect(result).toBe(0);
    });

    it('should parse number string without px', () => {
      const result = parseCssPx('15');
      expect(result).toBe(15);
    });
  });

  describe('computeColumnWidths', () => {
    it('should return empty array for zero columns', () => {
      const result = computeColumnWidths(0, 1000);
      expect(result).toEqual([]);
    });

    it('should return empty array for zero viewport width', () => {
      const result = computeColumnWidths(3, 0);
      expect(result).toEqual([]);
    });

    it('should distribute equal widths with default weights', () => {
      const result = computeColumnWidths(3, 300);
      expect(result).toEqual([100, 100, 100]);
    });

    it('should distribute widths based on weights', () => {
      const result = computeColumnWidths(2, 300, [2, 1]);
      expect(result.length).toBe(2);
      expect(result[0] + result[1]).toBe(300);
      expect(result[0]).toBeGreaterThan(result[1]);
    });

    it('should handle remainder distribution', () => {
      const result = computeColumnWidths(3, 100);
      expect(result.reduce((a, b) => a + b)).toBe(100);
    });

    it('should ignore invalid weights and use 1', () => {
      const result = computeColumnWidths(2, 200, [0, -1]);
      expect(result[0]).toBe(100);
      expect(result[1]).toBe(100);
    });

    it('should handle undefined weights', () => {
      const result = computeColumnWidths(2, 200, [undefined, undefined]);
      expect(result).toEqual([100, 100]);
    });
  });

  describe('calculateViewportHeight', () => {
    it('should calculate height within min and max bounds', () => {
      const bounds = new DOMRect(0, 100, 800, 600);
      const result = calculateViewportHeight(bounds, 50, 60, 10, 5);
      expect(result).toBeGreaterThanOrEqual(220); // min height
      expect(result).toBeLessThanOrEqual(520); // max height
    });

    it('should return min height when available height is small', () => {
      const bounds = new DOMRect(0, 800, 800, 600); // top at 800, significantly reducing available height
      const result = calculateViewportHeight(bounds, 0, 0, 0, 0, 24, 12, 220, 520);
      expect(result).toBeGreaterThanOrEqual(220); // Should not go below min
    });

    it('should respect custom min height', () => {
      const bounds = new DOMRect(0, 0, 800, 900);
      const result = calculateViewportHeight(bounds, 0, 0, 0, 0, 24, 12, 300, 520);
      expect(result).toBeGreaterThanOrEqual(300);
    });

    it('should respect custom max height', () => {
      const bounds = new DOMRect(0, 0, 800, 100);
      const result = calculateViewportHeight(bounds, 0, 0, 0, 0, 24, 12, 220, 400);
      expect(result).toBeLessThanOrEqual(400);
    });

    it('should account for header, footer, and chrome heights', () => {
      const bounds = new DOMRect(0, 100, 800, 600);
      const baseResult = calculateViewportHeight(bounds, 0, 0, 0, 0, 24, 12, 220, 520);
      const withHeightResult = calculateViewportHeight(bounds, 50, 60, 10, 5, 24, 12, 220, 520);
      expect(withHeightResult).toBeLessThanOrEqual(baseResult);
    });
  });

  describe('getElementHeight', () => {
    it('should return height from element', () => {
      const element = document.createElement('div');
      const mockBounds = new DOMRect(0, 0, 100, 50);
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockBounds);
      const result = getElementHeight(element);
      expect(result).toBe(50);
    });

    it('should return 0 for null element', () => {
      const result = getElementHeight(null);
      expect(result).toBe(0);
    });

    it('should ceil the height', () => {
      const element = document.createElement('div');
      const mockBounds = new DOMRect(0, 0, 100, 50.3);
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockBounds);
      const result = getElementHeight(element);
      expect(result).toBe(51);
    });
  });

  describe('getWrapperChromeHeight', () => {
    it('should calculate border heights', () => {
      const element = document.createElement('div');
      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        borderTopWidth: '5px',
        borderBottomWidth: '3px',
      } as any);

      const result = getWrapperChromeHeight(element);
      expect(result).toBe(8);
      mockGetComputedStyle.mockRestore();
    });

    it('should return 0 for zero borders', () => {
      const element = document.createElement('div');
      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
      } as any);

      const result = getWrapperChromeHeight(element);
      expect(result).toBe(0);
      mockGetComputedStyle.mockRestore();
    });
  });

  describe('getWrapperMarginBottom', () => {
    it('should get margin bottom', () => {
      const element = document.createElement('div');
      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        marginBottom: '10px',
      } as any);

      const result = getWrapperMarginBottom(element);
      expect(result).toBe(10);
      mockGetComputedStyle.mockRestore();
    });

    it('should return 0 for invalid margin', () => {
      const element = document.createElement('div');
      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        marginBottom: 'invalid',
      } as any);

      const result = getWrapperMarginBottom(element);
      expect(result).toBe(0);
      mockGetComputedStyle.mockRestore();
    });
  });
});
