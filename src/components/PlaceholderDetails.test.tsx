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

  it.each([
    'border',
    'border-dashed',
    'border-gray-400',
    'rounded-2xl',
    'p-12',
    'flex',
    'items-center',
    'justify-center',
    'min-h-60',
  ])('should have %s on the container', (className) => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    expect(div?.className).toContain(className);
  });

  it.each(['text-center', 'text-3xl', 'font-semibold', 'text-gray-600'])(
    'should have %s on the text',
    (className) => {
      const { container } = render(React.createElement(PlaceholderDetails));
      const p = container.querySelector('p');
      expect(p?.className).toContain(className);
    }
  );

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
    expect(divs).toHaveLength(1);
  });

  it('should have proper structure', () => {
    const { container } = render(React.createElement(PlaceholderDetails));
    const div = container.querySelector('div');
    const p = div?.querySelector('p');
    expect(p).toBeDefined();
    expect(p?.parentElement).toBe(div);
  });
});
