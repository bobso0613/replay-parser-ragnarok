import React, { useEffect, useState } from 'react';

type StickyButtonProps = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export const StickyButton = ({ scrollContainerRef }: StickyButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const isScrollableElement = (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const isScrollableY = styles.overflowY === 'auto' || styles.overflowY === 'scroll';
    const canActuallyScroll = element.scrollHeight > element.clientHeight + 1;

    return isScrollableY && canActuallyScroll;
  };

  const resolveScrollableTarget = (): HTMLElement | null => {
    const root = scrollContainerRef.current;

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

  useEffect(() => {
    const handleScroll = () => {
      const target = resolveScrollableTarget();
      const elementScrollTop = target?.scrollTop ?? 0;
      const pageScrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

      setIsVisible(Math.max(elementScrollTop, pageScrollTop) > 180);
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
    const target = resolveScrollableTarget();

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
