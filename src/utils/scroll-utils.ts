/**
 * Pure utility functions for scroll detection and management.
 *
 * These are extracted from components to enable full unit testing without
 * needing to mount React trees. All functions are side-effect-free except
 * for reading DOM computed styles and scroll positions.
 */

/**
 * Returns `true` when an element has a vertical scrollbar and actually has
 * content that overflows beyond its visible height.
 *
 * @param element - The DOM element to inspect.
 * @returns `true` if the element is scrollable in the Y axis.
 */
export const isScrollableElement = (element: HTMLElement): boolean => {
  const styles = window.getComputedStyle(element);
  const isScrollableY = styles.overflowY === 'auto' || styles.overflowY === 'scroll';
  const canActuallyScroll = element.scrollHeight > element.clientHeight + 1;

  return isScrollableY && canActuallyScroll;
};

/**
 * Resolves the best element to use as the scroll-tracking target for a given
 * root ref, following this priority order:
 *
 * 1. The deepest scrollable descendant (highest overflow capacity wins).
 * 2. The root element itself, if it is scrollable.
 * 3. The nearest scrollable ancestor in the DOM tree.
 * 4. `document.scrollingElement` as a final fallback.
 *
 * @param rootRef - React ref pointing to the component's root DOM element.
 * @returns The resolved scrollable element, or `null` if none is found.
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
 * Returns the current vertical scroll offset of the given element.
 *
 * Falls back to `window.scrollY` / `document.documentElement.scrollTop` when
 * `target` is `null` (i.e. the page itself is scrolling).
 *
 * @param target - The element whose `scrollTop` to read, or `null` for the page.
 * @returns The current scroll position in pixels.
 */
export const getScrollPosition = (target: HTMLElement | null): number => {
  if (!target) {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return target.scrollTop ?? 0;
};

/**
 * Returns `true` when the larger of the element scroll position and the page
 * scroll position exceeds the given threshold.
 *
 * @param scrollTop - Scroll offset of the tracked element in pixels.
 * @param pageScrollTop - Scroll offset of the page (`window.scrollY`) in pixels.
 * @param threshold - Minimum scroll distance required to return `true` (default: 180 px).
 * @returns Whether the scroll threshold has been exceeded.
 */
export const isScrollThresholdExceeded = (
  scrollTop: number,
  pageScrollTop: number,
  threshold: number = 180
): boolean => {
  return Math.max(scrollTop, pageScrollTop) > threshold;
};

/**
 * Reads the current scroll state from both an element and the page, and
 * determines whether the scroll-to-top button should be visible.
 *
 * @param target - The scrollable element to read, or `null` to use only page scroll.
 * @param threshold - Scroll distance in pixels above which `isVisible` becomes `true` (default: 180 px).
 * @returns An object with `elementScrollTop`, `pageScrollTop`, and `isVisible`.
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
