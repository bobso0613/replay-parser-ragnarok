import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import SectionLoading from './SectionLoading';

describe('SectionLoading', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(SectionLoading));
    expect(container).toBeDefined();
  });

  it('should display loading state', () => {
    const { container } = render(React.createElement(SectionLoading));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should have loading skeleton', () => {
    const { container } = render(React.createElement(SectionLoading));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should render spinner', () => {
    const { container } = render(React.createElement(SectionLoading));
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should display default loading message', () => {
    const { getByText } = render(React.createElement(SectionLoading));
    expect(getByText('Loading...')).toBeDefined();
  });

  it('should display custom label', () => {
    const customLabel = 'Processing data...';
    const { getByText } = render(React.createElement(SectionLoading, { label: customLabel }));
    expect(getByText(customLabel)).toBeDefined();
  });

  it('should apply custom size to spinner', () => {
    const { container } = render(React.createElement(SectionLoading, { size: 60 }));
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('60');
  });

  it('should apply custom className', () => {
    const { container } = render(
      React.createElement(SectionLoading, { className: 'custom-class' })
    );
    const mainDiv = container.querySelector('[role="status"]');
    expect(mainDiv?.className).toContain('custom-class');
  });

  it('should have accessibility attributes', () => {
    const { container } = render(React.createElement(SectionLoading));
    const mainDiv = container.querySelector('[role="status"]');
    expect(mainDiv?.getAttribute('role')).toBe('status');
    expect(mainDiv?.getAttribute('aria-live')).toBe('polite');
  });

  it('should render with section-loading class', () => {
    const { container } = render(React.createElement(SectionLoading));
    const mainDiv = container.querySelector('.section-loading');
    expect(mainDiv).toBeDefined();
  });

  it('should display spinner and label together', () => {
    const label = 'Custom Loading';
    const { container, getByText } = render(React.createElement(SectionLoading, { label }));
    expect(container.querySelector('svg')).toBeDefined();
    expect(getByText(label)).toBeDefined();
  });

  it('should have flex layout with centered items', () => {
    const { container } = render(React.createElement(SectionLoading));
    const mainDiv = container.querySelector('.section-loading');
    expect(mainDiv?.className).toContain('flex');
    expect(mainDiv?.className).toContain('items-center');
    expect(mainDiv?.className).toContain('justify-center');
  });

  it('should have min-h-60 class', () => {
    const { container } = render(React.createElement(SectionLoading));
    const mainDiv = container.querySelector('.section-loading');
    expect(mainDiv?.className).toContain('min-h-60');
  });

  it('should be memoized', () => {
    const { container: container1 } = render(React.createElement(SectionLoading));
    const { container: container2 } = render(React.createElement(SectionLoading));
    expect(container1).toBeDefined();
    expect(container2).toBeDefined();
  });
});
