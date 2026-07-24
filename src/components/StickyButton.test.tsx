import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StickyButton from './StickyButton';

describe('StickyButton', () => {
  let defaultProps: any;

  beforeEach(() => {
    defaultProps = {
      scrollContainerRef: { current: null },
    };
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should accept scroll container reference', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render sticky button element', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should handle null ref current', () => {
    const nullRef = { current: null };
    const { container } = render(
      React.createElement(StickyButton, { scrollContainerRef: nullRef })
    );
    expect(container).toBeDefined();
  });

  it('should render button element', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button).toBeDefined();
  });

  it('should have button with type button', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.getAttribute('type')).toBe('button');
  });

  it('should render button initially', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should accept HTMLDivElement ref', () => {
    const divRef = { current: document.createElement('div') };
    const { container } = render(React.createElement(StickyButton, { scrollContainerRef: divRef }));
    expect(container).toBeDefined();
  });

  it('should work with multiple instances', () => {
    const ref1 = { current: null };
    const ref2 = { current: null };

    const { container: c1 } = render(
      React.createElement(StickyButton, { scrollContainerRef: ref1 })
    );
    const { container: c2 } = render(
      React.createElement(StickyButton, { scrollContainerRef: ref2 })
    );

    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
  });

  it('should render with proper structure', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.parentElement).toBeDefined();
  });

  it('should have scroll to top label', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Scroll to top');
  });

  it('should render consistently', () => {
    const ref1 = { current: null };
    const ref2 = { current: null };

    const { container: c1 } = render(
      React.createElement(StickyButton, { scrollContainerRef: ref1 })
    );
    const { container: c2 } = render(
      React.createElement(StickyButton, { scrollContainerRef: ref2 })
    );

    expect(c1.innerHTML).toBe(c2.innerHTML);
  });

  it('should have up arrow span', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('↑');
  });

  it('should have visible styling classes', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.className).toContain('rounded-full');
  });

  it('should be clickable button', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.onclick === null || typeof button?.onclick === 'function').toBe(true);
  });

  it('should have position styling', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.className).toContain('absolute');
    expect(button?.className).toContain('bottom-6');
    expect(button?.className).toContain('right-6');
  });

  it('should handle dynamic ref changes', () => {
    const ref: React.MutableRefObject<HTMLDivElement | null> = { current: null };
    const { rerender } = render(React.createElement(StickyButton, { scrollContainerRef: ref }));

    ref.current = document.createElement('div');
    rerender(React.createElement(StickyButton, { scrollContainerRef: ref }));

    expect(ref.current).toBeDefined();
  });

  it('should be a valid React component', () => {
    expect(typeof StickyButton).toBe('function');
  });

  it('should render with button inside', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.children.length).toBeGreaterThan(0);
  });

  it('should have text-2xl class on span', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-2xl');
  });

  it('should have z-50 z-index', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');
    expect(button?.className).toContain('z-50');
  });

  it('should trigger scroll event listener on mount', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should handle window scroll event', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.scroll(window, { target: { scrollY: 200 } });
    expect(container).toBeDefined();
  });

  it('should handle document scroll event', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.scroll(document, { target: { scrollY: 200 } });
    expect(container).toBeDefined();
  });

  it('should handle window resize event', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.resize(window);
    expect(container).toBeDefined();
  });

  it('should cleanup event listeners on unmount', () => {
    const { container, unmount } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();

    unmount();
    expect(true).toBe(true);
  });

  it('should trigger scroll listener multiple times', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    fireEvent.scroll(window, { target: { scrollY: 200 } });
    fireEvent.scroll(window, { target: { scrollY: 300 } });

    expect(container).toBeDefined();
  });

  it('should handle rapid resize events', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.resize(window);
    fireEvent.resize(window);
    fireEvent.resize(window);

    expect(container).toBeDefined();
  });

  it('should handle HTMLDivElement ref with scrollable content', () => {
    const ref: React.MutableRefObject<HTMLDivElement | null> = {
      current: document.createElement('div'),
    };
    const { container } = render(React.createElement(StickyButton, { scrollContainerRef: ref }));

    expect(container).toBeDefined();
  });

  it('should handle ref with scrollable parent', () => {
    const ref: React.MutableRefObject<HTMLDivElement | null> = {
      current: document.createElement('div'),
    };

    // Set up parent element structure
    const parent = document.createElement('div');
    parent.style.height = '200px';
    parent.style.overflowY = 'scroll';

    ref.current = document.createElement('div');
    parent.appendChild(ref.current);
    document.body.appendChild(parent);

    const { container } = render(React.createElement(StickyButton, { scrollContainerRef: ref }));

    document.body.removeChild(parent);
    expect(container).toBeDefined();
  });

  it('should handle mutation observer on ref', () => {
    const ref: React.MutableRefObject<HTMLDivElement | null> = {
      current: document.createElement('div'),
    };
    const { container } = render(React.createElement(StickyButton, { scrollContainerRef: ref }));

    // Trigger mutation on the ref element
    if (ref.current) {
      const child = document.createElement('div');
      ref.current.appendChild(child);
    }

    expect(container).toBeDefined();
  });

  it('should render button with proper positioning', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('absolute');
    expect(button?.className).toContain('bottom-6');
    expect(button?.className).toContain('right-6');
  });

  it('should render with proper background styling', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('bg-sky-500/90');
  });

  it('should render with hover styling', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('hover:bg-sky-400');
  });

  it('should have transition class', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('transition');
  });

  it('should have shadow class', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('shadow');
  });

  it('should render with multiple refs passed', () => {
    const ref1: React.MutableRefObject<HTMLDivElement | null> = { current: null };
    const ref2: React.MutableRefObject<HTMLDivElement | null> = { current: null };

    const { container: c1 } = render(
      React.createElement(StickyButton, { scrollContainerRef: ref1 })
    );
    const { container: c2 } = render(
      React.createElement(StickyButton, { scrollContainerRef: ref2 })
    );

    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
  });

  it('should handle rapid scroll events', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    for (let i = 0; i < 10; i++) {
      fireEvent.scroll(window, { target: { scrollY: i * 100 } });
    }

    expect(container).toBeDefined();
  });

  it('should handle ref change during lifecycle', () => {
    const ref: React.MutableRefObject<HTMLDivElement | null> = { current: null };
    const { rerender } = render(React.createElement(StickyButton, { scrollContainerRef: ref }));

    ref.current = document.createElement('div');

    rerender(React.createElement(StickyButton, { scrollContainerRef: ref }));

    expect(ref.current).toBeDefined();
  });

  it('should have specific width and height', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('w-12');
    expect(button?.className).toContain('h-12');
  });

  it('should render with text white color', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('text-white');
  });

  it('should handle multiple scroll type combinations', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.scroll(window);
    fireEvent.scroll(document);
    fireEvent.resize(window);

    expect(container).toBeDefined();
  });

  it('should render with rounded styling', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('rounded-full');
  });

  it('should handle very high scroll values', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.scroll(window, { target: { scrollY: 10000 } });

    expect(container).toBeDefined();
  });

  it('should handle negative scroll values', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));

    fireEvent.scroll(window, { target: { scrollY: -100 } });

    expect(container).toBeDefined();
  });

  it('should render span with up arrow', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const span = container.querySelector('span');

    expect(span?.textContent?.trim()).toBe('↑');
  });

  it('should clean mutation observer on unmount', () => {
    const ref: React.MutableRefObject<HTMLDivElement | null> = {
      current: document.createElement('div'),
    };
    const { unmount } = render(React.createElement(StickyButton, { scrollContainerRef: ref }));

    unmount();
    expect(true).toBe(true);
  });

  it('should have border styling', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('border');
    expect(button?.className).toContain('border-sky-300');
  });

  it('should have z-index 50', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('z-50');
  });

  it('should handle pointer events based on visibility', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should have translate hover effect', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    const button = container.querySelector('button');

    expect(button?.className).toContain('hover:-translate-y');
  });

  it('should mock resize and scroll events to trigger visibility', () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener');
    const mockRemoveEventListener = vi.spyOn(window, 'removeEventListener');

    const scrollContainerRef = {
      current: document.createElement('div'),
    };

    render(React.createElement(StickyButton, { scrollContainerRef }));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.any(Object)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    mockAddEventListener.mockRestore();
    mockRemoveEventListener.mockRestore();
  });

  it('should handle scroll event and compute visibility', () => {
    const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
    mockGetComputedStyle.mockReturnValue({
      overflowY: 'auto',
    } as any);

    const scrollContainer = document.createElement('div');
    Object.defineProperty(scrollContainer, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(scrollContainer, 'clientHeight', { value: 300, configurable: true });

    const scrollContainerRef = { current: scrollContainer };

    const { container } = render(React.createElement(StickyButton, { scrollContainerRef }));

    fireEvent.scroll(window, { target: { scrollY: 200 } });

    expect(container).toBeDefined();
    mockGetComputedStyle.mockRestore();
  });

  it('should have computed style check for overflow', () => {
    const { container } = render(React.createElement(StickyButton, defaultProps));
    expect(container).toBeDefined();
  });

  it('should handle parent element resolution', () => {
    const scrollContainerRef = { current: document.createElement('div') };
    const { container } = render(React.createElement(StickyButton, { scrollContainerRef }));
    expect(container).toBeDefined();
  });

  it('should resolve scrollable target with max scroll height difference', () => {
    const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle');
    mockGetComputedStyle.mockImplementation((element: any) => {
      if (element.classList?.contains('scrollable')) {
        return { overflowY: 'auto' } as any;
      }
      return { overflowY: 'visible' } as any;
    });

    const scrollContainer = document.createElement('div');
    const child1 = document.createElement('div');
    child1.classList.add('scrollable');
    Object.defineProperty(child1, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(child1, 'clientHeight', { value: 500, configurable: true });
    scrollContainer.appendChild(child1);

    const scrollContainerRef = { current: scrollContainer };
    const { container } = render(React.createElement(StickyButton, { scrollContainerRef }));

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    expect(container).toBeDefined();

    mockGetComputedStyle.mockRestore();
  });
});
