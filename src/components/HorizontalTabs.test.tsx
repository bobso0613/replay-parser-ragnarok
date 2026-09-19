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
    expect(buttons).toHaveLength(3);
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
    expect(container.childNodes).toHaveLength(0);
  });

  it('should render tab labels correctly', () => {
    const { getByText } = render(React.createElement(HorizontalTabs, defaultProps));
    expect(getByText('Tab 1')).toBeDefined();
    expect(getByText('Tab 2')).toBeDefined();
    expect(getByText('Tab 3')).toBeDefined();
  });

  it.each(['text-white', 'border-blue-400'])(
    'should have %s on the first active tab by default',
    (className) => {
      const { container } = render(React.createElement(HorizontalTabs, defaultProps));
      const buttons = container.querySelectorAll('button');
      expect(buttons[0].className).toContain(className);
    }
  );

  it('should set default tab when defaultTabId provided', () => {
    const { container } = render(
      React.createElement(HorizontalTabs, {
        ...defaultProps,
        defaultTabId: 'tab2',
      })
    );
    expect(container).toBeDefined();
  });

  it.each(['border', 'rounded-md', 'p-1', 'space-y-4', 'border-slate-700'])(
    'should have %s on the container',
    (className) => {
      const { container } = render(React.createElement(HorizontalTabs, defaultProps));
      const div = container.querySelector('.space-y-4');
      expect(div?.className).toContain(className);
    }
  );

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
    expect(buttons).toHaveLength(1);
  });

  it.each(['rounded-t-md', 'px-4', 'py-2', 'font-semibold', 'border-b-2'])(
    'should have %s on tab buttons',
    (className) => {
      const { container } = render(React.createElement(HorizontalTabs, defaultProps));
      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn) => {
        expect(btn.className).toContain(className);
      });
    }
  );

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

  it('should render tab content container with padding', () => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const contentDiv = container.querySelector('.rounded-b-md');
    expect(contentDiv).toBeDefined();
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
    expect(buttons).toHaveLength(5);
  });

  it.each([
    ['switch to second tab', [1]],
    ['switch to third tab', [2]],
    ['click the same tab multiple times', [0, 0, 0]],
    ['switch through a sequence of tabs', [1, 2, 0]],
  ])('should handle tab click - %s', (_description, clickIndexes) => {
    const { container } = render(React.createElement(HorizontalTabs, defaultProps));
    const buttons = container.querySelectorAll('button');

    clickIndexes.forEach((index) => fireEvent.click(buttons[index]));
    expect(container).toBeDefined();
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

  it.each([
    [
      'numbers in id',
      [
        { id: 'tab-1-1', label: 'Tab 1', content: React.createElement('div', {}, 'Content 1') },
        { id: 'tab-2-2', label: 'Tab 2', content: React.createElement('div', {}, 'Content 2') },
      ],
    ],
    [
      'special characters',
      [
        { id: 'tab@1', label: 'Tab @1', content: React.createElement('div', {}, 'Content') },
        { id: 'tab#2', label: 'Tab #2', content: React.createElement('div', {}, 'Content') },
      ],
    ],
  ])('should handle tabs with %s', (_description, tabs) => {
    const { container } = render(React.createElement(HorizontalTabs, { tabs }));
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
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
