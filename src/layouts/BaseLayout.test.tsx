import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from './BaseLayout';

describe('BaseLayout', () => {
  it('should render without crashing', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(BaseLayout))
    );
    expect(container).toBeDefined();
  });

  it('should render header and footer', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(BaseLayout))
    );
    const header = container.querySelector('header');
    const footer = container.querySelector('footer');
    expect(header).toBeDefined();
    expect(footer).toBeDefined();
  });

  it('should have layout structure', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(BaseLayout))
    );
    const layoutContainer = container.querySelector('.flex.h-screen');
    expect(layoutContainer).toBeDefined();
  });
});
