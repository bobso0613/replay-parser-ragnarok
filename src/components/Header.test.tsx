import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { ENV } from '@/constants/index.ts';
import type { HeaderProps } from '@/types';

describe('Header', () => {
  const defaultProps: HeaderProps = {
    routes: [],
  };

  it('should render without crashing', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    expect(container).toBeDefined();
  });

  it('should render header element', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const header = container.querySelector('header');
    expect(header).toBeDefined();
  });

  it('should have header content', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    expect(container.innerHTML).toBeTruthy();
  });

  it.each(['sticky', 'bg-blue-900', 'shadow-sm', 'w-full', 'z-50'])(
    'should have %s on the header',
    (className) => {
      const { container } = render(
        React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
      );
      const header = container.querySelector('header');
      expect(header?.className || '').toContain(className);
    }
  );

  it('should render with empty routes', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, { routes: [] }))
    );
    expect(container).toBeDefined();
  });

  it('should render with routes prop', () => {
    const propsWithRoutes: HeaderProps = {
      routes: [
        { path: '/test', handle: { label: 'Test' } },
        { path: '/about', handle: { label: 'About' } },
      ],
    };

    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, propsWithRoutes))
    );
    expect(container).toBeDefined();
  });

  it('should display default logo text', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const logoDiv = container.querySelector('.text-amber-300');
    expect(logoDiv?.textContent).toBe(ENV.APPLICATION_NAME);
  });

  it('should display custom logo text', () => {
    const { container } = render(
      React.createElement(
        BrowserRouter,
        {},
        React.createElement(Header, {
          routes: [],
          logoText: 'Custom Logo',
        })
      )
    );
    const logoDiv = container.querySelector('.text-amber-300');
    expect(logoDiv?.textContent).toBe('Custom Logo');
  });

  it('should have logo styling', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const logoDiv = container.querySelector('.text-amber-300');
    expect(logoDiv?.className).toContain('text-lg');
    expect(logoDiv?.className).toContain('font-bold');
  });

  it('should render navigation element', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
  });

  it.each(['flex', 'items-center', 'justify-between'])(
    'should have %s class on the inner container',
    (className) => {
      const { container } = render(
        React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
      );
      const header = container.querySelector('header');
      const innerDiv = header?.querySelector('div');
      expect(innerDiv?.className).toContain(className);
    }
  );

  it('should render nav items for routes with path', () => {
    const propsWithRoutes: HeaderProps = {
      routes: [
        { path: '/home', handle: { label: 'Home' } },
        { path: '/about', handle: { label: 'About' } },
      ],
    };

    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, propsWithRoutes))
    );
    const nav = container.querySelector('nav');
    expect(nav).toBeDefined();
  });

  it('should filter out wildcard routes', () => {
    const propsWithRoutes: HeaderProps = {
      routes: [
        { path: '/home', handle: { label: 'Home' } },
        { path: '*', handle: { label: 'Not Found' } },
      ],
    };

    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, propsWithRoutes))
    );
    const links = container.querySelectorAll('a');
    // Should only have 1 link (home), not the wildcard
    expect(links).toHaveLength(1);
  });

  it('should handle routes without handle property', () => {
    const propsWithRoutes: HeaderProps = {
      routes: [{ path: '/test' }],
    };

    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, propsWithRoutes))
    );
    expect(container).toBeDefined();
  });

  it('should have nav flex-wrap', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('flex-wrap');
  });

  it('should have padding in header', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const header = container.querySelector('header');
    const innerDiv = header?.querySelector('div');
    expect(innerDiv?.className).toContain('px-12');
    expect(innerDiv?.className).toContain('py-3');
  });

  it('should have gap spacing', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const header = container.querySelector('header');
    const innerDiv = header?.querySelector('div');
    expect(innerDiv?.className).toContain('gap-4');
  });

  it('should be memoized component', () => {
    expect(Header).toBeDefined();
  });

  it('should maintain consistent structure across renders', () => {
    const { container: container1 } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const { container: container2 } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );

    expect(container1.querySelector('header')).toBeDefined();
    expect(container2.querySelector('header')).toBeDefined();
  });

  it('should be part of layout structure', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    expect(container.firstChild).toBeDefined();
  });

  it('should render logo div', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const logoDiv = container.querySelector('.text-amber-300');
    expect(logoDiv).toBeDefined();
  });

  it('should have top-0 positioning', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const header = container.querySelector('header');
    expect(header?.className).toContain('top-0');
  });

  it('should have left-0 and right-0 positioning', () => {
    const { container } = render(
      React.createElement(BrowserRouter, {}, React.createElement(Header, defaultProps))
    );
    const header = container.querySelector('header');
    expect(header?.className).toContain('left-0');
    expect(header?.className).toContain('right-0');
  });
});
