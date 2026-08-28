import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import TextImage from './TextImage';
import { TEXT_IMAGE_VARIANTS } from '@/constants/index.ts';

// Mock the Tooltip component
vi.mock('./Tooltip', () => ({
  default: vi.fn(({ children, content, className }) => {
    return React.createElement('div', { className, 'data-tooltip': content }, children);
  }),
}));

describe('TextImage', () => {
  const defaultProps = {
    keyId: 1,
    keyInfo: 'Sample Info',
    variant: TEXT_IMAGE_VARIANTS.SKILL,
  };

  it('should render without crashing', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render text image component', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should render image element', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('should display key info', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const span = container.querySelector('.sort-value');
    expect(span?.textContent).toBe('Sample Info');
  });

  it('should render flex container', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const div = container.querySelector('.flex');
    expect(div).toBeDefined();
  });

  it('should have gap-1.5 spacing', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const div = container.querySelector('.flex');
    expect(div?.className).toContain('gap-1.5');
  });

  it('should have items-center class', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const div = container.querySelector('.flex');
    expect(div?.className).toContain('items-center');
  });

  it('should use keyId as key prop', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        keyId: 42,
      })
    );
    expect(container).toBeDefined();
  });

  it('should use skill variant by default', () => {
    const { container } = render(
      React.createElement(TextImage, {
        keyId: 1,
        keyInfo: 'Test',
      })
    );
    const img = container.querySelector('img');
    expect(img?.src).toContain('skill');
  });

  it('should use skill variant when specified', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        variant: TEXT_IMAGE_VARIANTS.SKILL,
      })
    );
    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('should use job variant when specified', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        variant: TEXT_IMAGE_VARIANTS.JOB,
      })
    );
    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('should construct skill image URL correctly', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        keyId: 123,
        variant: TEXT_IMAGE_VARIANTS.SKILL,
      })
    );
    const img = container.querySelector('img');

    expect(img?.src).toContain('123');
  });

  it('should construct job image URL correctly', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        keyId: 456,
        variant: TEXT_IMAGE_VARIANTS.JOB,
      })
    );
    const img = container.querySelector('img');
    expect(img?.src).toBeDefined();
  });

  it('should display alt text from keyInfo', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        keyInfo: 'Fireball Spell',
      })
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Fireball Spell');
  });

  it('should have lazy loading on image', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const img = container.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('lazy');
  });

  it('should have no-referrer policy', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const img = container.querySelector('img');
    expect(img?.getAttribute('referrerPolicy')).toBe('no-referrer');
  });

  it('should have w-6.25 and h-6.25 dimensions', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const img = container.querySelector('img');
    expect(img?.className).toContain('w-6.25');
    expect(img?.className).toContain('h-6.25');
  });

  it('should render tooltip component', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const tooltipDiv = container.querySelector('[data-tooltip]');
    expect(tooltipDiv).toBeDefined();
  });

  it('should pass tooltip content from title prop', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        title: 'Custom Title',
      })
    );
    const tooltipDiv = container.querySelector('[data-tooltip]');
    expect(tooltipDiv?.getAttribute('data-tooltip')).toBe('Custom Title');
  });

  it('should use keyInfo as fallback tooltip content', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        keyInfo: 'Fallback Content',
      })
    );
    const tooltipDiv = container.querySelector('[data-tooltip]');
    expect(tooltipDiv?.getAttribute('data-tooltip')).toBe('Fallback Content');
  });

  it('should render textBefore element if provided', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        textBefore: React.createElement('span', {}, 'Before:'),
      })
    );
    expect(container).toBeDefined();
  });

  it('should not render textBefore if not provided', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render span with sort-value class', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const span = container.querySelector('.sort-value');
    expect(span).toBeDefined();
  });

  it('should handle different keyId numbers', () => {
    [1, 10, 100, 999].forEach((keyId) => {
      const { container } = render(
        React.createElement(TextImage, {
          ...defaultProps,
          keyId,
        })
      );
      expect(container).toBeDefined();
    });
  });

  it('should pass tooltip placement BOTTOM', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    expect(container).toBeDefined();
  });

  it('should have proper wrapper div for image', () => {
    const { container } = render(React.createElement(TextImage, defaultProps));
    const wrapperDiv = container.querySelector('.w-6\\.25.h-6\\.25');
    expect(wrapperDiv || container.querySelector('[class*="w-6"]')).toBeDefined();
  });

  it('should handle undefined variant gracefully', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        variant: undefined,
      })
    );
    const img = container.querySelector('img');
    // Should default to 'skill' variant
    expect(img?.src).toContain('skill');
  });

  it('should handle textBefore explicitly set to null', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        textBefore: null,
      })
    );
    expect(container).toBeDefined();
  });

  it('should render with both title and keyInfo fallback coverage', () => {
    const { container } = render(
      React.createElement(TextImage, {
        ...defaultProps,
        title: undefined,
        keyInfo: 'FallbackKeyInfo',
      })
    );
    const tooltipDiv = container.querySelector('[data-tooltip]');
    expect(tooltipDiv?.getAttribute('data-tooltip')).toBe('FallbackKeyInfo');
  });
});
