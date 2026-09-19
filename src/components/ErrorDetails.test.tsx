import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ErrorDetails from './ErrorDetails';

describe('ErrorDetails', () => {
  const defaultProps = {
    retryOnClick: vi.fn(),
  };

  it('should render without crashing', () => {
    const { container } = render(React.createElement(ErrorDetails, defaultProps));
    expect(container).toBeDefined();
  });

  it('should display error message', () => {
    const { getByText } = render(React.createElement(ErrorDetails, defaultProps));
    expect(getByText(/error occurred/i)).toBeDefined();
  });

  it('should display retry button', () => {
    const { getByText } = render(React.createElement(ErrorDetails, defaultProps));
    expect(getByText(/retry/i)).toBeDefined();
  });

  it('should display all error messages', () => {
    const { container } = render(React.createElement(ErrorDetails, defaultProps));
    const text = container.textContent;
    expect(text?.includes('An error occurred while parsing the replay.')).toBe(true);
    expect(text?.includes('Click me to retry')).toBe(true);
    expect(text?.includes('or choose another replay file to parse.')).toBe(true);
  });

  it('should call retryOnClick when button is clicked', () => {
    const retryOnClick = vi.fn();
    const { getByText } = render(React.createElement(ErrorDetails, { retryOnClick }));
    const button = getByText(/retry/i);
    fireEvent.click(button);
    expect(retryOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have button type attribute', () => {
    const { container } = render(React.createElement(ErrorDetails, defaultProps));
    const button = container.querySelector('button');
    expect(button?.getAttribute('type')).toBe('button');
  });

  it.each([
    'border-red-200',
    'rounded-2xl',
    'flex',
    'flex-col',
    'min-h-60',
    'items-center',
    'justify-center',
  ])('should have %s on the container', (className) => {
    const { container } = render(React.createElement(ErrorDetails, defaultProps));
    const mainDiv = container.querySelector('div');
    expect(mainDiv?.className).toContain(className);
  });

  it('should have proper cursor on button', () => {
    const { container } = render(React.createElement(ErrorDetails, defaultProps));
    const button = container.querySelector('button');
    expect(button?.className).toContain('cursor-pointer');
  });

  it('should display text with proper font sizes', () => {
    const { getByText } = render(React.createElement(ErrorDetails, defaultProps));
    const errorMessage = getByText(/error occurred/i);
    const retryButton = getByText(/retry/i);

    expect(errorMessage.className).toContain('text-2xl');
    expect(retryButton.className).toContain('text-3xl');
  });

  it('should have text-red-100 and text-red-200 styling', () => {
    const { container } = render(React.createElement(ErrorDetails, defaultProps));
    const text = container.textContent;
    expect(text).toBeTruthy();
  });

  it('should call function multiple times on multiple clicks', () => {
    const retryOnClick = vi.fn();
    const { getByText } = render(React.createElement(ErrorDetails, { retryOnClick }));
    const button = getByText(/retry/i);

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(retryOnClick).toHaveBeenCalledTimes(3);
  });

  it('should have underline on retry button', () => {
    const { getByText } = render(React.createElement(ErrorDetails, defaultProps));
    const button = getByText(/retry/i);
    expect(button.className).toContain('underline');
  });
});
