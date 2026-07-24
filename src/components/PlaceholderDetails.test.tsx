import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import PlaceholderDetails from './PlaceholderDetails';

describe('PlaceholderDetails', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    expect(container).toBeDefined();
  });

  it('should display placeholder content', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should have placeholder elements', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should display correct text message', () => {
    const { getByText } = render(React.createElement(PlaceholderDetails));
    expect(getByText(/Statistics will be shown in this area/i)).toBeDefined();
  });

  it('should have dashed border', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('border-dashed');
  });

  it('should have gray-400 border color', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('border-gray-400');
  });

  it('should have rounded-2xl corner radius', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('rounded-2xl');
  });

  it('should have padding', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('p-12');
  });

  it('should have flex layout', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('flex');
  });

  it('should have items-center class', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('items-center');
  });

  it('should have justify-center class', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('justify-center');
  });

  it('should have minimum height of 60 (min-h-60)', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('min-h-60');
  });

  it('should have centered text', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    expect(p?.className).toContain('text-center');
  });

  it('should have large text size (text-3xl)', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    expect(p?.className).toContain('text-3xl');
  });

  it('should have semibold font weight', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    expect(p?.className).toContain('font-semibold');
  });

  it('should have gray-600 text color', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    expect(p?.className).toContain('text-gray-600');
  });

  it('should contain paragraph element', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    expect(p).toBeDefined();
  });

  it('should have correct placeholder text content', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    expect(p?.textContent).toBe('Statistics will be shown in this area');
  });

  it('should have single root div', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const divs = container.querySelectorAll(':scope > div');
    expect(divs.length).toBe(1);
  });

  it('should have proper structure', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    const p = div?.querySelector('p');
    expect(p).toBeDefined();
    expect(p?.parentElement).toBe(div);
  });

  it('should have border class', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain('border');
  });

  it('should render all styling classes together', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    const expectedClasses = [
      'border',
      'border-dashed',
      'border-gray-400',
      'rounded-2xl',
      'p-12',
      'flex',
      'items-center',
      'justify-center',
      'min-h-60',
    ];
    expectedClasses.forEach((cls) => {
      expect(div?.className).toContain(cls);
    });
  });

  it('should render text styling classes correctly', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const p = container.querySelector('p');
    const expectedClasses = ['text-center', 'text-3xl', 'font-semibold', 'text-gray-600'];
    expectedClasses.forEach((cls) => {
      expect(p?.className).toContain(cls);
    });
  });
});
