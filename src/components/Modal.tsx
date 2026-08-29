import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';

/**
 * Props for {@link Modal}.
 *
 * @property isOpen - Whether the modal is rendered.
 * @property onClose - Callback invoked by the close button, Escape key, or backdrop click.
 * @property title - Content displayed in the modal header.
 * @property children - Content displayed in the scrollable modal body.
 * @property footer - Optional content displayed in the fixed modal footer.
 * @property disableOutsideClick - Prevents backdrop clicks from closing the modal when `true`.
 */
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  disableOutsideClick?: boolean;
};

/**
 * A controlled, responsive dialog with a fixed header and optional footer.
 * The body is the only scrollable section. By default, clicking the backdrop
 * closes the modal; set `disableOutsideClick` to prevent that behavior.
 *
 * @param props - {@link ModalProps}
 * @returns The rendered dialog when `isOpen` is `true`; otherwise `null`.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  disableOutsideClick = false,
}: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-1 sm:p-6"
      role="presentation"
      onMouseDown={disableOutsideClick ? undefined : onClose}
    >
      <section
        className="flex h-[95vh] w-[75vw] max-h-[95vh] max-w-[95vw] flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-[0_0_28px_rgba(229,231,235,0.2),0_24px_48px_rgba(0,0,0,0.45)] max-sm:h-[98vh] max-sm:w-[98vw] max-sm:max-h-[98vh] max-sm:max-w-[98vw]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-500 px-5 py-4">
          <h2 id={titleId} className="m-0 translate-y-1 text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close modal"
            className="grid size-9 shrink-0 place-items-center rounded-md leading-none text-gray-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none cursor-pointer"
            onClick={onClose}
          >
            <span aria-hidden="true" className="-translate-y-2.5 text-5xl">
              &times;
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <footer className="shrink-0 border-t border-gray-500 px-5 py-4">{footer}</footer>
        ) : null}
      </section>
    </div>
  );
};

export default Modal;
