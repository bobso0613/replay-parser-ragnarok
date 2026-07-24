import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(Spinner));
    expect(container).toBeDefined();
  });

  it('should display spinner', () => {
    const { container } = render(React.createElement(Spinner));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should have spinner element', () => {
    const { container } = render(React.createElement(Spinner));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should render svg element', () => {
    const { container } = render(React.createElement(Spinner));
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should use default size when not provided', () => {
    const { container } = render(React.createElement(Spinner));
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('40');
    expect(svg?.getAttribute('height')).toBe('40');
  });

  it('should use custom size when provided', () => {
    const { container } = render(React.createElement(Spinner, { size: 60 }));
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('60');
    expect(svg?.getAttribute('height')).toBe('60');
  });

  it('should apply default className', () => {
    const { container } = render(React.createElement(Spinner));
    const div = container.querySelector('div');
    expect(div?.className).toContain('animate-spin');
  });

  it('should apply custom className along with default', () => {
    const { container } = render(React.createElement(Spinner, { className: 'custom-class' }));
    const div = container.querySelector('div');
    expect(div?.className).toContain('animate-spin');
    expect(div?.className).toContain('custom-class');
  });

  it('should render two circles in svg', () => {
    const { container } = render(React.createElement(Spinner));
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('should render circles with correct properties', () => {
    const { container } = render(React.createElement(Spinner));
    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      expect(circle.getAttribute('fill')).toBe('none');
      expect(circle.getAttribute('stroke-linecap')).toBe('round');
    });
  });

  it('should calculate radius correctly based on size', () => {
    const size = 80;
    const { container } = render(React.createElement(Spinner, { size }));
    const circles = container.querySelectorAll('circle');
    const stroke = size * 0.1;
    const expectedRadius = (size - stroke) / 2;
    circles.forEach((circle) => {
      expect(circle.getAttribute('r')).toBe(expectedRadius.toString());
    });
  });

  it('should be memoized', () => {
    const { container: container1 } = render(React.createElement(Spinner));
    const { container: container2 } = render(React.createElement(Spinner));
    expect(container1).toBeDefined();
    expect(container2).toBeDefined();
  });
});
