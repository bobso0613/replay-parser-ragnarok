import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

const renderModal = (overrides: Partial<React.ComponentProps<typeof Modal>> = {}) => {
  const onClose = vi.fn();
  const props = {
    isOpen: true,
    onClose,
    title: 'Details',
    children: 'Modal content',
    ...overrides,
  };

  return { onClose, ...render(React.createElement(Modal, props)) };
};

describe('Modal', () => {
  it('does not render when closed', () => {
    const { queryByRole } = renderModal({ isOpen: false });

    expect(queryByRole('dialog')).toBeNull();
  });

  it('renders a dialog with a ReactNode title and scrollable body', () => {
    const { getByRole, getByText } = renderModal({
      title: React.createElement('span', null, 'Replay details'),
    });

    expect(getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(getByText('Replay details')).toBeInTheDocument();
    expect(getByText('Modal content').className).toContain('overflow-y-auto');
  });

  it('renders the footer only when provided', () => {
    const { queryByText, rerender } = renderModal();

    expect(queryByText('Save')).toBeNull();

    rerender(
      React.createElement(Modal, {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Details',
        footer: React.createElement('button', { type: 'button' }, 'Save'),
        children: 'Modal content',
      })
    );

    expect(queryByText('Save')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const { onClose, getByRole } = renderModal();

    fireEvent.click(getByRole('button', { name: 'Close modal' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const { onClose } = renderModal();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the backdrop is clicked by default', () => {
    const { onClose, container } = renderModal();

    fireEvent.mouseDown(container.firstElementChild!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when the dialog is clicked or outside clicks are disabled', () => {
    const { onClose, container, getByRole } = renderModal({ disableOutsideClick: true });

    fireEvent.mouseDown(getByRole('dialog'));
    fireEvent.mouseDown(container.firstElementChild!);

    expect(onClose).not.toHaveBeenCalled();
  });
});
