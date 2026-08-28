import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './Home';
import * as services from '@/services';

vi.mock('@/services', () => ({ fetchReplay: vi.fn(), fetchReplayApi: vi.fn() }));

const replay = { replayVersion: '1.0', players: [], monsters: [], outputId: 'output-1' };

describe('Home', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the upload and placeholder views without database requests', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Select file')).toBeInTheDocument();
    expect(screen.getByText(/Statistics will be shown/)).toBeInTheDocument();
    expect(services.fetchReplay).not.toHaveBeenCalled();
    expect(services.fetchReplayApi).not.toHaveBeenCalled();
  });

  it('selects a file and sends it to the parser API', async () => {
    vi.mocked(services.fetchReplayApi).mockResolvedValue(replay);
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const input = screen.getByDisplayValue('') as HTMLInputElement;
    const file = new File(['data'], 'replay.rrf', { type: 'application/octet-stream' });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(services.fetchReplayApi).toHaveBeenCalled());
    expect(vi.mocked(services.fetchReplayApi).mock.calls[0][0]).toBeInstanceOf(FormData);
  });

  it('loads a replay from a route output ID', async () => {
    vi.mocked(services.fetchReplay).mockResolvedValue(replay);
    render(
      <MemoryRouter initialEntries={['/replay/output-1']}>
        <Routes>
          <Route path="/replay/:outputId" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(services.fetchReplay).toHaveBeenCalledWith(
        expect.stringContaining('/output-1'),
        expect.any(AbortController)
      )
    );
  });

  it('shows the error state when parsing fails', async () => {
    vi.mocked(services.fetchReplayApi).mockRejectedValue(new Error('parse failed'));
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const input = screen.getByDisplayValue('') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(['data'], 'replay.rrf')] } });
    await waitFor(() => expect(services.fetchReplayApi).toHaveBeenCalled());
  });
});
