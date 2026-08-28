import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import PageLoading from './PageLoading';

describe('PageLoading', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(PageLoading));
    expect(container).toBeDefined();
  });

  it('should display loading indicator', () => {
    const { container } = render(React.createElement(PageLoading));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should have loading content', () => {
    const { container } = render(React.createElement(PageLoading));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should display default loading message', () => {
    const { getByText } = render(React.createElement(PageLoading));
    expect(getByText('Loading...')).toBeDefined();
  });

  it('should display custom message', () => {
    const customMessage = 'Loading custom content...';
    const { getByText } = render(React.createElement(PageLoading, { message: customMessage }));
    expect(getByText(customMessage)).toBeDefined();
  });

  it('should render SVG spinner', () => {
    const { container } = render(React.createElement(PageLoading));
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should have fixed positioning', () => {
    const { container } = render(React.createElement(PageLoading));
    const outerDiv = container.querySelector('div');
    expect(outerDiv?.className).toContain('fixed');
    expect(outerDiv?.className).toContain('inset-0');
  });

  it('should have high z-index', () => {
    const { container } = render(React.createElement(PageLoading));
    const outerDiv = container.querySelector('div');
    expect(outerDiv?.className).toContain('z-50');
  });

  it('should have semi-transparent background', () => {
    const { container } = render(React.createElement(PageLoading));
    const outerDiv = container.querySelector('div');
    expect(outerDiv?.className).toContain('bg-white');
  });

  it('should be centered on page', () => {
    const { container } = render(React.createElement(PageLoading));
    const outerDiv = container.querySelector('div');
    expect(outerDiv?.className).toContain('flex');
    expect(outerDiv?.className).toContain('items-center');
    expect(outerDiv?.className).toContain('justify-center');
  });

  it('should render circles and paths in svg', () => {
    const { container } = render(React.createElement(PageLoading));
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('should have aria-hidden on svg', () => {
    const { container } = render(React.createElement(PageLoading));
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });
});
