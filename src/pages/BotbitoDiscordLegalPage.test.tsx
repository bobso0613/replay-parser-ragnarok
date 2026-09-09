import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BotbitoDiscordLegalPage from './BotbitoDiscordLegalPage';

const legalContent = {
  termsOfService: {
    title: 'Terms of Service',
    lastUpdated: '2026-09-09',
    intro: 'Terms introduction.',
    sections: [{ heading: 'Service', paragraphs: ['Service terms.'] }],
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: '2026-09-09',
    intro: 'Privacy introduction.',
    sections: [{ heading: 'Information', paragraphs: ['Privacy terms.'] }],
  },
};

describe('BotbitoDiscordLegalPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(legalContent) })
    );
  });

  it.each(['Terms of Service', 'Privacy Policy'] as const)(
    'renders the %s document from the legal JSON in a full-width container',
    async (title) => {
      render(<BotbitoDiscordLegalPage title={title} />);

      expect(
        await screen.findByText(
          title === 'Terms of Service' ? 'Terms introduction.' : 'Privacy introduction.'
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Botbito Discord' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
      expect(screen.getByRole('region')).toHaveClass('w-full');
    }
  );

  it('shows an error message when the legal content cannot be loaded', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    render(<BotbitoDiscordLegalPage title="Terms of Service" />);

    expect(await screen.findByText('Unable to load this document.')).toBeInTheDocument();
  });
});
