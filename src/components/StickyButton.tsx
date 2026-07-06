import React, { useEffect, useState } from 'react';

type StickyButtonProps = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export const StickyButton = ({ scrollContainerRef }: StickyButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return () => {};
    }

    const handleScroll = () => {
      setIsVisible(scrollContainer.scrollTop > 180);
    };

    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef]);

  const handleScrollTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleScrollTop}
      className={`fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full border border-sky-300/50 bg-sky-500/90 text-white shadow-lg shadow-sky-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-400 ${
        isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="text-2xl leading-none">↑</span>
    </button>
  );
};

export default StickyButton;
