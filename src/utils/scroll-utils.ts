/**
 * Pure utility functions for scroll detection and management
 * These are extracted from components to enable full unit testing
 */

/**
 * Check if an element is scrollable (has overflow and scroll capacity)
 */
export const isScrollableElement = (element: HTMLElement): boolean => {
  const styles = window.getComputedStyle(element);
  const isScrollableY = styles.overflowY === 'auto' || styles.overflowY === 'scroll';
  const canActuallyScroll = element.scrollHeight > element.clientHeight + 1;

  return isScrollableY && canActuallyScroll;
};

/**
 * Resolve which element to use for scroll tracking
 * Priority: descendants with scroll > root if scrollable > parent chain > document
 */
export const resolveScrollableTarget = (
  rootRef: React.RefObject<HTMLElement | null>
): HTMLElement | null => {
  const root = rootRef.current;

  if (root) {
    const descendants = Array.from(root.querySelectorAll<HTMLElement>('*')).filter((element) =>
      isScrollableElement(element)
    );

    if (descendants.length > 0) {
      return descendants.sort(
        (a, b) => b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight)
      )[0];
    }

    if (isScrollableElement(root)) {
      return root;
    }
  }

  let current = root?.parentElement ?? null;

  while (current) {
    if (isScrollableElement(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return document.scrollingElement as HTMLElement | null;
};

/**
 * Calculate current scroll position from various sources
 */
export const getScrollPosition = (target: HTMLElement | null): number => {
  if (!target) {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return target.scrollTop ?? 0;
};

/**
 * Determine if scroll position exceeds threshold for visibility
 */
export const isScrollThresholdExceeded = (
  scrollTop: number,
  pageScrollTop: number,
  threshold: number = 180
): boolean => {
  return Math.max(scrollTop, pageScrollTop) > threshold;
};

/**
 * Get computed scroll position from both element and page sources
 */
export const getComputedScrollTop = (
  target: HTMLElement | null,
  threshold: number = 180
): { elementScrollTop: number; pageScrollTop: number; isVisible: boolean } => {
  const elementScrollTop = target?.scrollTop ?? 0;
  const pageScrollTop =
    window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const isVisible = Math.max(elementScrollTop, pageScrollTop) > threshold;

  return { elementScrollTop, pageScrollTop, isVisible };
};
