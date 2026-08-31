import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import React from 'react';
import { ENV } from '@/constants';
import { getPageMetadata, usePageTitle } from './usePageTitle';

const applicationName = ENV.APPLICATION_NAME || 'Replay Parser Ragnarok';

const PageTitleProbe = () => {
  const { logoText } = usePageTitle();

  return React.createElement('span', null, logoText);
};

describe('getPageMetadata', () => {
  it('uses the application name for replay parser pages', () => {
    expect(getPageMetadata('/replay-parser/shared-output')).toEqual({
      logoText: 'Replay Parser',
      title: `Replay Parser | ${applicationName}`,
    });
  });

  it('uses the Bastion guide name for the guide page', () => {
    expect(getPageMetadata('/bastion-guide')).toEqual({
      logoText: 'Bastion Guide',
      title: `Bastion Guide | ${applicationName}`,
    });
  });

  it('updates the document title for the active route', () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/bastion-guide'] },
        React.createElement(PageTitleProbe)
      )
    );

    expect(document.title).toBe(`Bastion Guide | ${applicationName}`);
    expect(screen.getByText('Bastion Guide')).toBeInTheDocument();
  });
});
