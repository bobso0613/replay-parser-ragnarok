import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock the AppRouter component
vi.mock('@/routes/AppRouter', () => ({
  default: () => React.createElement('div', { 'data-testid': 'app-router' }, 'App Router'),
}));

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(App));
    expect(container).toBeDefined();
  });

  it('should render AppRouter component', () => {
    const { getByTestId } = render(React.createElement(App));
    expect(getByTestId('app-router')).toBeDefined();
  });
});
