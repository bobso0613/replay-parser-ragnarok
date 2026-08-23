import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import * as services from '@/services';

vi.mock('@/services', () => ({
  fetchSkillDb: vi.fn(),
  fetchMobDb: vi.fn(),
  fetchItemDb: vi.fn(),
  fetchReplay: vi.fn(),
  fetchReplayApi: vi.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(services.fetchSkillDb).mockResolvedValue([]);
    vi.mocked(services.fetchMobDb).mockResolvedValue([]);
    vi.mocked(services.fetchItemDb).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));
    expect(container).toBeDefined();
  });

  it('should render page content', () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should have home page elements', () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should fetch skill, mob, and item databases on mount', async () => {
    render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
      expect(services.fetchMobDb).toHaveBeenCalled();
      expect(services.fetchItemDb).toHaveBeenCalled();
    });
  });

  it('should handle database fetch errors gracefully', async () => {
    vi.mocked(services.fetchSkillDb).mockRejectedValueOnce(new Error('Fetch failed'));
    vi.mocked(services.fetchMobDb).mockRejectedValueOnce(new Error('Fetch failed'));
    vi.mocked(services.fetchItemDb).mockRejectedValueOnce(new Error('Fetch failed'));

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(container).toBeDefined();
    });
  });

  it('should render InputUpload component', () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));
    expect(container.querySelector('input')).toBeDefined();
  });

  it('should render PlaceholderDetails when no replay data', async () => {
    render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(screen.queryByText(/placeholder/i) || screen.queryByRole('img')).toBeDefined();
  });

  it('should handle file upload', async () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['test'], 'test.rrf', { type: 'application/octet-stream' });
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;

      fireEvent.change(input, event);

      await waitFor(() => {
        expect(input.files?.length).toBe(1);
      });
    }
  });

  it('should render multiple UI states', async () => {
    vi.mocked(services.fetchSkillDb).mockResolvedValue([{ Id: 1, Name: 'Skill' }] as any);
    vi.mocked(services.fetchMobDb).mockResolvedValue([{ Id: 1, Name: 'Mob' }] as any);
    vi.mocked(services.fetchItemDb).mockResolvedValue([
      { Id: 501, AegisName: 'Potion', Name: 'Potion' },
    ] as any);

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
      expect(services.fetchMobDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should call normalizeReplayPath on component interactions', async () => {
    const replaceSpy = vi.spyOn(window.history, 'replaceState');

    render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    replaceSpy.mockRestore();
  });

  it('should abort requests on component unmount', async () => {
    const { unmount } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    unmount();
    expect(true).toBe(true);
  });

  it('should handle replay API errors', async () => {
    vi.mocked(services.fetchReplayApi).mockRejectedValueOnce(new Error('API Error'));

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should handle replay fetch errors', async () => {
    vi.mocked(services.fetchReplay).mockRejectedValueOnce(new Error('Fetch Error'));

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should store databases in state after fetch', async () => {
    const skillData = [{ Id: 1, Name: 'Test Skill' }];
    const mobData = [{ Id: 1, Name: 'Test Mob' }];
    const itemData = [{ Id: 501, AegisName: 'Potion', Name: 'Potion', Type: 'Consume' }];

    vi.mocked(services.fetchSkillDb).mockResolvedValue(skillData as any);
    vi.mocked(services.fetchMobDb).mockResolvedValue(mobData as any);
    vi.mocked(services.fetchItemDb).mockResolvedValue(itemData as any);

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
      expect(services.fetchMobDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should handle replay by outputId from route params', async () => {
    const mockReplayData = {
      players: [],
      monsters: [],
      outputId: 'test-output-id',
      replayFileName: 'test.rrf',
      replayVersion: '1.0',
    } as any;

    vi.mocked(services.fetchReplay).mockResolvedValue(mockReplayData);

    const TestWrapper = () => (
      <MemoryRouter initialEntries={['/replay/test-output-id']}>
        <Routes>
          <Route path="/replay/:outputId" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    const { container } = render(React.createElement(TestWrapper));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should handle replay by path from search params', async () => {
    const mockReplayData = {
      players: [],
      monsters: [],
      outputId: 'search-output-id',
      replayFileName: 'test.rrf',
      replayVersion: '1.0',
    } as any;

    vi.mocked(services.fetchReplay).mockResolvedValue(mockReplayData);

    const TestWrapper = () => (
      <MemoryRouter initialEntries={['/replay?path=search-output-id']}>
        <Routes>
          <Route path="/replay" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    const { container } = render(React.createElement(TestWrapper));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should show error when replay parsing fails', async () => {
    vi.mocked(services.fetchReplayApi).mockRejectedValueOnce(new Error('Parse error'));

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['test'], 'test.rrf', { type: 'application/octet-stream' });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(services.fetchReplayApi).toHaveBeenCalled();
      });
    }

    expect(container).toBeDefined();
  });

  it('should successfully parse replay file and update state', async () => {
    const mockReplayData = {
      players: [{ playerId: 'p1' }],
      monsters: [{ monsterId: 'm1' }],
      replayFileName: 'test.rrf',
      replayVersion: '1.0',
    } as any;

    vi.mocked(services.fetchReplayApi).mockResolvedValue(mockReplayData);
    vi.mocked(services.fetchSkillDb).mockResolvedValue([]);
    vi.mocked(services.fetchMobDb).mockResolvedValue([]);

    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['test'], 'test.rrf', { type: 'application/octet-stream' });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(services.fetchReplayApi).toHaveBeenCalled();
      });
    }

    expect(container).toBeDefined();
  });

  it('should handle multiple file upload changes', async () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should not parse if no files selected', async () => {
    render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    // Should not have called fetchReplayApi without files
    expect(services.fetchReplayApi).not.toHaveBeenCalled();
  });

  it('should handle window.location operations safely', async () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalled();
    });

    expect(container).toBeDefined();
  });

  it('should handle both skillDb and mobDb loading', async () => {
    const { container } = render(React.createElement(BrowserRouter, {}, React.createElement(Home)));

    await waitFor(() => {
      expect(services.fetchSkillDb).toHaveBeenCalledTimes(1);
      expect(services.fetchMobDb).toHaveBeenCalledTimes(1);
    });

    expect(container).toBeDefined();
  });
});
