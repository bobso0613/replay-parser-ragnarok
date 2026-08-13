import React, { useEffect, useState } from 'react';
import { resolveScrollableTarget, getComputedScrollTop } from '@/utils/scroll-utils';

type StickyButtonProps = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

/**
 * Floating scroll-to-top button that becomes visible after the user scrolls
 * past the scroll threshold (~180 px).
 *
 * Attaches listeners to both `window` and the resolved scrollable target
 * (via {@link resolveScrollableTarget}) so it works regardless of whether the
 * page itself or a nested overflow container is scrolling. A `MutationObserver`
 * recalculates visibility when DOM children are added or removed.
 *
 * Visibility is controlled via opacity and `pointer-events` so the button
 * fades in/out without layout shifts.
 *
 * @param scrollContainerRef - Ref to the scrollable container element.
 */
export const StickyButton = ({ scrollContainerRef }: StickyButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const target = resolveScrollableTarget(scrollContainerRef);
      const { isVisible: visible } = getComputedScrollTop(target);
      setIsVisible(visible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleScroll);

    const observerRoot = scrollContainerRef.current;
    const mutationObserver =
      observerRoot !== null
        ? new MutationObserver(() => {
            handleScroll();
          })
        : null;

    if (mutationObserver && observerRoot) {
      mutationObserver.observe(observerRoot, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
      mutationObserver?.disconnect();
    };
  }, [scrollContainerRef]);

  const handleScrollTop = () => {
    const target = resolveScrollableTarget(scrollContainerRef);

    if (target) {
      target.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleScrollTop}
      className={`absolute bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-sky-300/50 bg-sky-500/90 text-white shadow-lg shadow-sky-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-400 ${
        isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="text-2xl leading-none">↑</span>
    </button>
  );
};

export default StickyButton;
