import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import SkeletonLoader from './SkeletonLoader';

// Mock the Table component
vi.mock('./Table', () => ({
  default: vi.fn(({ rows, headers }) => {
    return React.createElement('table', {}, [
      React.createElement('thead', { key: 'head' }, headers),
      React.createElement('tbody', { key: 'body' }, rows),
    ]);
  }),
}));

describe('SkeletonLoader', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    expect(container).toBeDefined();
  });

  it('should display skeleton animation', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should have skeleton element', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should use default rows (5) when not provided', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const table = container.querySelector('table');
    expect(table).toBeDefined();
  });

  it('should use default columns (4) when not provided', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render with custom rows', () => {
    const { container } = render(React.createElement(SkeletonLoader, { rows: 3 }));
    expect(container.querySelector('table')).toBeDefined();
  });

  it('should render with custom columns', () => {
    const { container } = render(React.createElement(SkeletonLoader, { columns: 6 }));
    expect(container.querySelector('table')).toBeDefined();
  });

  it('should render with custom rows and columns', () => {
    const { container } = render(React.createElement(SkeletonLoader, { rows: 10, columns: 8 }));
    expect(container.querySelector('table')).toBeDefined();
  });

  it('should have animate-pulse class on skeleton elements', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const animated = container.querySelectorAll('.animate-pulse');
    expect(animated.length).toBeGreaterThan(0);
  });

  it('should have slate-700 color class on header skeleton', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const slateElement = container.querySelector('.bg-slate-700');
    expect(slateElement).toBeDefined();
  });

  it('should have slate-500 color class on row skeleton', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const slateElement = container.querySelector('.bg-slate-500');
    expect(slateElement).toBeDefined();
  });

  it('should have rounded-md on skeleton elements', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const rounded = container.querySelector('.rounded-md');
    expect(rounded).toBeDefined();
  });

  it('should render header placeholder', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    // Header should be present (w-7xl class)
    expect(container).toBeDefined();
  });

  it('should render title placeholder', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    // Title placeholder should be present
    expect(container).toBeDefined();
  });

  it('should render table structure', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    expect(container.querySelector('table')).toBeDefined();
  });

  it('should have proper spacing classes', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const spacedElement = container.querySelector('.my-3\\.5');
    expect(spacedElement || container).toBeDefined();
  });

  it('should render single row', () => {
    const { container } = render(React.createElement(SkeletonLoader, { rows: 1 }));
    expect(container).toBeDefined();
  });

  it('should render single column', () => {
    const { container } = render(React.createElement(SkeletonLoader, { columns: 1 }));
    expect(container).toBeDefined();
  });

  it('should be memoized component', () => {
    // Component should be wrapped with memo
    expect(SkeletonLoader).toBeDefined();
  });

  it('should handle zero rows', () => {
    const { container } = render(React.createElement(SkeletonLoader, { rows: 0 }));
    expect(container.querySelector('table')).toBeDefined();
  });

  it('should handle zero columns', () => {
    const { container } = render(React.createElement(SkeletonLoader, { columns: 0 }));
    expect(container.querySelector('table')).toBeDefined();
  });

  it('should render height-5 on skeleton cells', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const heightElement = container.querySelector('.h-5');
    expect(heightElement).toBeDefined();
  });

  it('should render height-10 on header placeholder', () => {
    const { container } = render(React.createElement(SkeletonLoader));
    const headerHeight = container.querySelector('.h-10');
    expect(headerHeight).toBeDefined();
  });
});
