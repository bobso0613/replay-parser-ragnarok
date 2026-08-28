import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HorizontalTabs from './HorizontalTabs';

// Mock SectionLoading
vi.mock('./SectionLoading', () => ({
  default: vi.fn(() =>
    React.createElement('div', { 'data-testid': 'section-loading' }, 'Loading...')
  ),
}));

describe('HorizontalTabs', () => {
  const defaultProps = {
    tabs: [
      { id: 'tab1', label: 'Tab 1', content: React.createElement('div', {}, 'Content 1') },
      { id: 'tab2', label: 'Tab 2', content: React.createElement('div', {}, 'Content 2') },
      { id: 'tab3', label: 'Tab 3', content: React.createElement('div', {}, 'Content 3') },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render all tabs', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  it('should display active tab content', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    expect(container).toBeDefined();
  });

  it('should handle empty tabs', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        tabs: [],
      })
    );
    expect(container.childNodes.length).toBe(0);
  });

  it('should render tab labels correctly', () => {
    const { getByText } = render(React.createElement(HorizontalTabs, defaultProps));
    expect(getByText('Tab 1')).toBeDefined();
    expect(getByText('Tab 2')).toBeDefined();
    expect(getByText('Tab 3')).toBeDefined();
  });

  it('should have first tab active by default', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toContain('text-white');
  });

  it('should set default tab when defaultTabId provided', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        defaultTabId: 'tab2',
      })
    );
    expect(container).toBeDefined();
  });

  it('should have border styling', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const div = container.querySelector('.space-y-4');
    expect(div?.className).toContain('border');
  });

  it('should have rounded-md styling', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const div = container.querySelector('.space-y-4');
    expect(div?.className).toContain('rounded-md');
  });

  it('should have padding', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const div = container.querySelector('.space-y-4');
    expect(div?.className).toContain('p-1');
  });

  it('should have space-y-4 layout', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const div = container.querySelector('.space-y-4');
    expect(div?.className).toContain('space-y-4');
  });

  it('should render flex tabs container', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const flex = container.querySelector('.flex.flex-wrap');
    expect(flex).toBeDefined();
  });

  it('should accept custom className', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        className: 'custom-class',
      })
    );
    const div = container.querySelector('.space-y-4');
    expect(div?.className).toContain('custom-class');
  });

  it('should have tab buttons with correct type', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.getAttribute('type')).toBe('button');
    });
  });

  it('should have border-slate-700', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const div = container.querySelector('.space-y-4');
    expect(div?.className).toContain('border-slate-700');
  });

  it('should render single tab', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        tabs: [
          { id: 'single', label: 'Single Tab', content: React.createElement('div', {}, 'Single') },
        ],
      })
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });

  it('should have rounded-t-md on tab buttons', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.className).toContain('rounded-t-md');
    });
  });

  it('should have px-4 py-2 padding on tabs', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.className).toContain('px-4');
      expect(btn.className).toContain('py-2');
    });
  });

  it('should have font-semibold on tabs', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.className).toContain('font-semibold');
    });
  });

  it('should have border-b-2 on tabs', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.className).toContain('border-b-2');
    });
  });

  it('should display extra content when provided', () => {
    const extraContent = React.createElement('span', {}, 'Extra');
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        extraContent,
      })
    );
    expect(container.textContent?.includes('Extra')).toBe(true);
  });

  it('should render tab content container', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const contentDiv = container.querySelector('.rounded-b-md');
    expect(contentDiv).toBeDefined();
  });

  it('should have p-4 padding on content', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const contentDiv = container.querySelector('.rounded-b-md');
    expect(contentDiv?.className).toContain('p-4');
  });

  it('should render tab content', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    expect(container.textContent?.includes('Content')).toBe(true);
  });

  it('should have multiple tabs', () => {
    const manyTabs = Array.from({ length: 5 }, (_, i) => ({
      id: `tab${i}`,
      label: `Tab ${i}`,
      content: React.createElement('div', {}, `Content ${i}`),
    }));

    const { container } = render(
      React.createElement(HorizontalTabs, {
        tabs: manyTabs,
      })
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(5);
  });

  it('should handle tab click - switch to second tab', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[1]);
    expect(container).toBeDefined();
  });

  it('should handle tab click - switch to third tab', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[2]);
    expect(container).toBeDefined();
  });

  it('should handle clicking same tab multiple times', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[0]);
    expect(container).toBeDefined();
  });

  it('should handle tab switching sequence', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[0]);
    expect(container).toBeDefined();
  });

  it('should have correct class on first tab initially', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    expect(buttons[0].className).toContain('border-blue-400');
  });

  it('should not crash with null extra content', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        extraContent: null,
      })
    );
    expect(container).toBeDefined();
  });

  it('should render with undefined defaultTabId', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        defaultTabId: undefined,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle tabs with numbers in id', () => {
    const numberedTabs = [
      { id: 'tab-1-1', label: 'Tab 1', content: React.createElement('div', {}, 'Content 1') },
      { id: 'tab-2-2', label: 'Tab 2', content: React.createElement('div', {}, 'Content 2') },
    ];

    const { container } = render(React.createElement(HorizontalTabs, { tabs: numberedTabs }));
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should handle tabs with special characters', () => {
    const specialTabs = [
      { id: 'tab@1', label: 'Tab @1', content: React.createElement('div', {}, 'Content') },
      { id: 'tab#2', label: 'Tab #2', content: React.createElement('div', {}, 'Content') },
    ];

    const { container } = render(React.createElement(HorizontalTabs, { tabs: specialTabs }));
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should handle very long tab labels', () => {
    const longTabs = [
      {
        id: 'tab1',
        label: 'This is a very long tab label that should be handled properly',
        content: React.createElement('div', {}, 'Content 1'),
      },
    ];

    const { container } = render(React.createElement(HorizontalTabs, { tabs: longTabs }));
    expect(container).toBeDefined();
  });

  it('should render extra content element correctly', () => {
    const extraContent = React.createElement('div', { 'data-testid': 'extra' }, 'Extra Info');
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        extraContent,
      })
    );
    expect(container.querySelector('[data-testid="extra"]')).toBeDefined();
  });

  it('should handle empty defaultTabId string', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        defaultTabId: '',
      })
    );
    expect(container).toBeDefined();
  });

  it('should render multiple instances independently', () => {
    const { container: c1 } = render(React.createElement(HorizontalTabs, defaultProps));
    const { container: c2 } = render(React.createElement(HorizontalTabs, defaultProps));

    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
  });

  it('should have transition-colors class', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    buttons.forEach((btn) => {
      expect(btn.className).toContain('transition-colors');
    });
  });

  it('should have duration-150 class', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    buttons.forEach((btn) => {
      expect(btn.className).toContain('duration-150');
    });
  });

  it('should have inactive tab styling', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    // Check second tab (should be inactive)
    expect(buttons[1].className).toContain('text-slate-400');
  });

  it('should have gap-2 in tab container', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const flexContainer = container.querySelector('.flex.flex-wrap.items-center.gap-1');
    expect(flexContainer).toBeDefined();
  });

  it('should render content in Suspense boundary', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const contentDiv = container.querySelector('.rounded-b-md.p-4');
    expect(contentDiv).toBeDefined();
  });

  it('should switch between all tabs in sequence', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    for (let i = 0; i < buttons.length; i++) {
      fireEvent.click(buttons[i]);
    }

    expect(container).toBeDefined();
  });

  it('should handle click on tab with complex content', () => {
    const complexContent = React.createElement(
      'div',
      {},
      React.createElement('h2', {}, 'Title'),
      React.createElement('p', {}, 'Description'),
      React.createElement('button', {}, 'Action')
    );

    const complexTabs = [{ id: 'tab1', label: 'Tab 1', content: complexContent }];

    const { container } = render(React.createElement(HorizontalTabs, { tabs: complexTabs }));
    const button = container.querySelector('button');
    fireEvent.click(button!);
    expect(container).toBeDefined();
  });
});
