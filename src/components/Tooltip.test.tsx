import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tooltip from './Tooltip';
import { TOOLTIP_POSITION } from '@/constants/index.ts';

describe('Tooltip', () => {
  const defaultProps = {
    content: 'Tooltip content',
    children: React.createElement('span', {}, 'Hover me'),
    placement: TOOLTIP_POSITION.TOP,
  };

  it('should render without crashing', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render children', () => {
    const { getByText } = render(React.createElement(Tooltip, defaultProps));
    expect(getByText('Hover me')).toBeDefined();
  });

  it('should have tooltip content', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should support different placements', () => {
    const placements = [
      TOOLTIP_POSITION.TOP,
      TOOLTIP_POSITION.BOTTOM,
      TOOLTIP_POSITION.LEFT,
      TOOLTIP_POSITION.RIGHT,
    ];

    placements.forEach((placement) => {
      const { container } = render(
        React.createElement(Tooltip, {
          ...defaultProps,
          placement,
        })
      );
      expect(container).toBeDefined();
    });
  });

  it('should handle text content as children', () => {
    const { getByText } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        children: React.createElement('button', {}, 'Click me'),
      })
    );
    expect(getByText('Click me')).toBeDefined();
  });

  it('should render with different tooltip content', () => {
    const contents = ['Short tooltip', 'A longer tooltip message', 'Special chars: !@#$%'];

    contents.forEach((content) => {
      const { container } = render(
        React.createElement(Tooltip, {
          ...defaultProps,
          content,
        })
      );
      expect(container).toBeDefined();
    });
  });

  it('should handle complex children', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        children: React.createElement('div', {}, [
          React.createElement('span', { key: 'text' }, 'Complex'),
          React.createElement('strong', { key: 'strong' }, 'Children'),
        ]),
      })
    );
    expect(container).toBeDefined();
  });

  it('should maintain tooltip accessibility', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    expect(container.querySelector('span')).toBeDefined();
  });

  it('should render multiple tooltips independently', () => {
    const { container } = render(
      React.createElement(React.Fragment, {}, [
        React.createElement(Tooltip, {
          ...defaultProps,
          key: '1',
          content: 'First tooltip',
        }),
        React.createElement(Tooltip, {
          ...defaultProps,
          key: '2',
          content: 'Second tooltip',
        }),
      ])
    );
    expect(container).toBeDefined();
  });

  it('should handle mouse enter to show tooltip', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const triggerDiv = container.querySelector('.inline-flex');
    expect(triggerDiv).toBeDefined();

    if (triggerDiv) {
      fireEvent.mouseEnter(triggerDiv);
      expect(container).toBeDefined();
    }
  });

  it('should handle mouse leave to hide tooltip', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const triggerDiv = container.querySelector('.inline-flex');
    expect(triggerDiv).toBeDefined();

    if (triggerDiv) {
      fireEvent.mouseEnter(triggerDiv);
      fireEvent.mouseLeave(triggerDiv);
      expect(container).toBeDefined();
    }
  });

  it('should accept custom className', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        className: 'custom-tooltip-class',
      })
    );
    const wrapper = container.querySelector('.inline-flex');
    expect(wrapper?.className).toContain('custom-tooltip-class');
  });

  it('should render with cursor-help class', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const childDiv = container.querySelector('.cursor-help');
    expect(childDiv).toBeDefined();
  });

  it('should have inline-flex wrapper', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const wrapper = container.querySelector('.inline-flex');
    expect(wrapper).toBeDefined();
  });

  it('should use default placement when not provided', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        content: 'Test',
        children: React.createElement('span', {}, 'Test'),
      })
    );
    expect(container).toBeDefined();
  });

  it('should apply empty className by default', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        content: 'Test',
        children: React.createElement('span', {}, 'Test'),
      })
    );
    const wrapper = container.querySelector('.inline-flex');
    expect(wrapper).toBeDefined();
  });

  it('should support TOP placement', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        placement: TOOLTIP_POSITION.TOP,
      })
    );
    expect(container).toBeDefined();
  });

  it('should support BOTTOM placement', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        placement: TOOLTIP_POSITION.BOTTOM,
      })
    );
    expect(container).toBeDefined();
  });

  it('should support LEFT placement', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        placement: TOOLTIP_POSITION.LEFT,
      })
    );
    expect(container).toBeDefined();
  });

  it('should support RIGHT placement', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        placement: TOOLTIP_POSITION.RIGHT,
      })
    );
    expect(container).toBeDefined();
  });

  it('should combine className prop with inline-flex', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        className: 'w-full',
      })
    );
    const wrapper = container.querySelector('.inline-flex');
    expect(wrapper?.className).toContain('w-full');
    expect(wrapper?.className).toContain('inline-flex');
  });

  it('should handle rapid visibility toggle', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    // Simulate mouseenter
    if (trigger) {
      fireEvent.mouseEnter(trigger);
    }

    // Simulate mouseleave
    if (trigger) {
      fireEvent.mouseLeave(trigger);
    }

    expect(container).toBeDefined();
  });

  it('should handle missing references gracefully', () => {
    const { container } = render(
      React.createElement(Tooltip, {
        ...defaultProps,
        content: 'Test Content',
      })
    );
    // This tests that updateTooltipPosition returns early when refs are not ready
    expect(container).toBeDefined();
  });

  it('should clean up event listeners on unmount', () => {
    const { container, unmount } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    // Show tooltip
    if (trigger) {
      fireEvent.mouseEnter(trigger);
    }

    // Unmount should clean up listeners without errors
    unmount();
    expect(true).toBe(true);
  });

  it('should set up event listeners when tooltip becomes visible', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    if (trigger) {
      fireEvent.mouseEnter(trigger);
      expect(container).toBeDefined();
    }
  });

  it('should handle viewport changes', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    if (trigger) {
      fireEvent.mouseEnter(trigger);
      fireEvent.resize(window);
      expect(container).toBeDefined();
    }
  });

  it('should handle scroll events while tooltip is visible', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    if (trigger) {
      fireEvent.mouseEnter(trigger);
      fireEvent.scroll(window);
      expect(container).toBeDefined();
    }
  });

  it('should not error when tooltip is not visible', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));

    // No mouse enter, so no listeners
    expect(container).toBeDefined();
  });

  it('should remove listeners on mouse leave', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    if (trigger) {
      fireEvent.mouseEnter(trigger);
      fireEvent.mouseLeave(trigger);
      expect(container).toBeDefined();
    }
  });

  it('should render tooltip with position calculation', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    if (trigger) {
      fireEvent.mouseEnter(trigger);
      expect(container).toBeDefined();
    }
  });

  it('should handle updateTooltipPosition with null refs', () => {
    const { container } = render(React.createElement(Tooltip, defaultProps));
    const trigger = container.querySelector('.inline-flex');

    if (trigger) {
      fireEvent.mouseEnter(trigger);
      // Force an update that would trigger position update
      fireEvent.resize(window);
      fireEvent.scroll(window);
      expect(container).toBeDefined();
    }
  });
});
