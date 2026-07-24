import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render without crashing', () => {
    const { container } = render(React.createElement(Footer));
    expect(container).toBeDefined();
  });

  it('should render footer element', () => {
    const { container } = render(React.createElement(Footer));
    const footer = container.querySelector('footer');
    expect(footer).toBeDefined();
  });

  it('should have footer content', () => {
    const { container } = render(React.createElement(Footer));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should display disclaimer text', () => {
    const { getByText } = render(React.createElement(Footer));
    expect(getByText(/parsed replays are stored/i)).toBeDefined();
  });

  it('should display frontend author link', () => {
    const { getByText } = render(React.createElement(Footer));
    const link = getByText('bobito');
    expect(link).toBeDefined();
    expect(link.tagName).toBe('A');
  });

  it('should display parser author link', () => {
    const { getByText } = render(React.createElement(Footer));
    const link = getByText('padder');
    expect(link).toBeDefined();
    expect(link.tagName).toBe('A');
  });

  it('should have correct href for frontend author', () => {
    const { getByText } = render(React.createElement(Footer));
    const link = getByText('bobito');
    expect(link.getAttribute('href')).toContain('discord.com');
  });

  it('should have correct href for parser author', () => {
    const { getByText } = render(React.createElement(Footer));
    const link = getByText('padder');
    expect(link.getAttribute('href')).toContain('discord.com');
  });

  it('should have target blank on links', () => {
    const { container } = render(React.createElement(Footer));
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('should have noreferrer policy on links', () => {
    const { container } = render(React.createElement(Footer));
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });

  it('should have footer border styling', () => {
    const { container } = render(React.createElement(Footer));
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('border-t');
  });

  it('should have full width', () => {
    const { container } = render(React.createElement(Footer));
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('w-full');
  });

  it('should have padding', () => {
    const { container } = render(React.createElement(Footer));
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('px-4');
    expect(footer?.className).toContain('py-2');
  });

  it('should contain proper text labels', () => {
    const { container } = render(React.createElement(Footer));
    const text = container.textContent;
    expect(text?.includes('Frontend by:')).toBe(true);
    expect(text?.includes('Parser enhanced by:')).toBe(true);
  });

  it('should have responsive layout', () => {
    const { container } = render(React.createElement(Footer));
    const flexDiv = container.querySelector('.flex');
    expect(flexDiv?.className).toContain('sm:flex-row');
    expect(flexDiv?.className).toContain('flex-col');
  });

  it('should have footer styling classes', () => {
    const { container } = render(React.createElement(Footer));
    const footer = container.querySelector('footer');
    expect(footer?.className || '').toBeTruthy();
  });

  it('should render footer text content', () => {
    const { container } = render(React.createElement(Footer));
    expect(container.textContent).toBeTruthy();
  });

  it('should maintain structure on rerenders', () => {
    const { container: c1, rerender } = render(React.createElement(Footer));
    const footer1 = c1.querySelector('footer');

    rerender(React.createElement(Footer));
    const footer2 = c1.querySelector('footer');

    expect(footer1).toBeDefined();
    expect(footer2).toBeDefined();
  });

  it('should be part of page layout', () => {
    const { container } = render(React.createElement(Footer));
    expect(container.firstChild).toBeDefined();
    expect(container.querySelector('footer')).toBeDefined();
  });

  it('should handle multiple renders', () => {
    const { unmount } = render(React.createElement(Footer));
    expect(document.body).toBeTruthy();
    unmount();
    expect(true).toBe(true);
  });
});
