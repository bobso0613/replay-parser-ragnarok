import { describe, it, expect, vi } from 'vitest';
import {
  isScrollableElement,
  resolveScrollableTarget,
  getScrollPosition,
  isScrollThresholdExceeded,
  getComputedScrollTop,
} from './scroll-utils';

describe('scroll-utils', () => {
  describe('isScrollableElement', () => {
    it('should return true for element with overflow-y auto and scrollable height', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 300, configurable: true });

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      } as any);

      const result = isScrollableElement(element);

      expect(result).toBe(true);
      mockGetComputedStyle.mockRestore();
    });

    it('should return true for element with overflow-y scroll and scrollable height', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 300, configurable: true });

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'scroll',
      } as any);

      const result = isScrollableElement(element);

      expect(result).toBe(true);
      mockGetComputedStyle.mockRestore();
    });

    it('should return false for element without scrollable height', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 300, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 300, configurable: true });

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      } as any);

      const result = isScrollableElement(element);

      expect(result).toBe(false);
      mockGetComputedStyle.mockRestore();
    });

    it('should return false for element with overflow-y hidden', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 300, configurable: true });

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'hidden',
      } as any);

      const result = isScrollableElement(element);

      expect(result).toBe(false);
      mockGetComputedStyle.mockRestore();
    });

    it('should return false for element with overflow-y visible', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(element, 'clientHeight', { value: 300, configurable: true });

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'visible',
      } as any);

      const result = isScrollableElement(element);

      expect(result).toBe(false);
      mockGetComputedStyle.mockRestore();
    });
  });

  describe('resolveScrollableTarget', () => {
    it('should return root if root is scrollable and no descendants', () => {
      const root = document.createElement('div');
      Object.defineProperty(root, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(root, 'clientHeight', { value: 300, configurable: true });

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockReturnValue({
        overflowY: 'auto',
      } as any);

      const ref = { current: root };
      const result = resolveScrollableTarget(ref);

      expect(result).toBe(root);
      mockGetComputedStyle.mockRestore();
    });

    it('should return most scrollable descendant', () => {
      const root = document.createElement('div');
      const child1 = document.createElement('div');
      const child2 = document.createElement('div');

      Object.defineProperty(child1, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(child1, 'clientHeight', { value: 500, configurable: true });
      Object.defineProperty(child2, 'scrollHeight', { value: 2000, configurable: true });
      Object.defineProperty(child2, 'clientHeight', { value: 500, configurable: true });

      root.appendChild(child1);
      root.appendChild(child2);

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockImplementation((element: any) => {
        if (element === child1 || element === child2) {
          return { overflowY: 'auto' } as any;
        }
        return { overflowY: 'visible' } as any;
      });

      const ref = { current: root };
      const result = resolveScrollableTarget(ref);

      expect(result).toBe(child2);
      mockGetComputedStyle.mockRestore();
    });

    it('should return null if root is null', () => {
      const ref = { current: null };
      const result = resolveScrollableTarget(ref);

      expect(result).toBe(document.scrollingElement);
    });

    it('should traverse parent chain if no scrollable descendants', () => {
      const root = document.createElement('div');
      const parent = document.createElement('div');

      Object.defineProperty(parent, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(parent, 'clientHeight', { value: 300, configurable: true });

      document.body.appendChild(parent);
      parent.appendChild(root);

      const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
      mockGetComputedStyle.mockImplementation((element: any) => {
        if (element === parent) {
          return { overflowY: 'auto' } as any;
        }
        return { overflowY: 'visible' } as any;
      });

      const ref = { current: root };
      const result = resolveScrollableTarget(ref);

      expect(result).toBe(parent);
      mockGetComputedStyle.mockRestore();
      document.body.removeChild(parent);
    });
  });

  describe('getScrollPosition', () => {
    it('should return target scrollTop if target exists', () => {
      const target = document.createElement('div');
      Object.defineProperty(target, 'scrollTop', { value: 100, configurable: true });

      const result = getScrollPosition(target);

      expect(result).toBe(100);
    });

    it('should return window.scrollY if target is null', () => {
      const result = getScrollPosition(null);

      // In jsdom, scrollY defaults to 0
      expect(result).toBe(0);
    });

    it('should handle target with undefined scrollTop', () => {
      const target = document.createElement('div');
      Object.defineProperty(target, 'scrollTop', { value: undefined, configurable: true });

      const result = getScrollPosition(target);

      expect(result).toBe(0);
    });
  });

  describe('isScrollThresholdExceeded', () => {
    it('should return true if scrollTop exceeds threshold', () => {
      const result = isScrollThresholdExceeded(200, 0, 180);

      expect(result).toBe(true);
    });

    it('should return true if pageScrollTop exceeds threshold', () => {
      const result = isScrollThresholdExceeded(0, 200, 180);

      expect(result).toBe(true);
    });

    it('should return false if neither exceeds threshold', () => {
      const result = isScrollThresholdExceeded(100, 0, 180);

      expect(result).toBe(false);
    });

    it('should use default threshold of 180', () => {
      const result = isScrollThresholdExceeded(200, 0);

      expect(result).toBe(true);
    });

    it('should return true if equal to max and max exceeds threshold', () => {
      const result = isScrollThresholdExceeded(181, 0, 180);

      expect(result).toBe(true);
    });

    it('should return false if equal to threshold', () => {
      const result = isScrollThresholdExceeded(180, 0, 180);

      expect(result).toBe(false);
    });
  });

  describe('getComputedScrollTop', () => {
    it('should return correct values with valid target', () => {
      const target = document.createElement('div');
      Object.defineProperty(target, 'scrollTop', { value: 100, configurable: true });

      const result = getComputedScrollTop(target, 180);

      expect(result.elementScrollTop).toBe(100);
      expect(result.pageScrollTop).toBe(0);
      expect(result.isVisible).toBe(false);
    });

    it('should return isVisible true when threshold exceeded', () => {
      const target = document.createElement('div');
      Object.defineProperty(target, 'scrollTop', { value: 200, configurable: true });

      const result = getComputedScrollTop(target, 180);

      expect(result.isVisible).toBe(true);
    });

    it('should compute from page scroll if target is null', () => {
      const result = getComputedScrollTop(null, 180);

      expect(result.elementScrollTop).toBe(0);
      expect(result.pageScrollTop).toBe(0);
      expect(result.isVisible).toBe(false);
    });

    it('should use max of elementScrollTop and pageScrollTop for visibility', () => {
      const target = document.createElement('div');
      Object.defineProperty(target, 'scrollTop', { value: 150, configurable: true });

      // Mock window.scrollY
      const originalScrollY = window.scrollY;
      Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });

      const result = getComputedScrollTop(target, 180);

      expect(result.isVisible).toBe(false);
      expect(Math.max(result.elementScrollTop, result.pageScrollTop)).toBe(150);

      Object.defineProperty(window, 'scrollY', { value: originalScrollY, configurable: true });
    });

    it('should handle custom threshold', () => {
      const target = document.createElement('div');
      Object.defineProperty(target, 'scrollTop', { value: 50, configurable: true });

      const result = getComputedScrollTop(target, 30);

      expect(result.isVisible).toBe(true);
    });
  });
});
