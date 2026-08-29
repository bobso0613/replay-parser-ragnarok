import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModalProvider, useModal } from './ModalContext';

const ModalLauncher = () => {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      onClick={() =>
        openModal({
          title: 'Placeholder title',
          content: 'Placeholder content',
        })
      }
    >
      Show modal
    </button>
  );
};

let consumerRenderCount = 0;

const RenderCounter = () => {
  useModal();
  consumerRenderCount += 1;
  return null;
};

describe('ModalProvider', () => {
  it('does not rerender modal consumers when dialog state changes', () => {
    consumerRenderCount = 0;
    render(
      <ModalProvider>
        <ModalLauncher />
        <RenderCounter />
      </ModalProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show modal' }));

    expect(consumerRenderCount).toBe(1);
  });

  it('opens and closes modal content requested by a consumer', () => {
    render(
      <ModalProvider>
        <ModalLauncher />
      </ModalProvider>
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Show modal' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Placeholder title')).toBeInTheDocument();
    expect(screen.getByText('Placeholder content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
