import { createContext, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@/components/Modal';

type ModalContent = {
  title: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  disableOutsideClick?: boolean;
};

type ModalContextValue = {
  closeModal: () => void;
  openModal: (content: ModalContent) => void;
};

type ModalProviderProps = {
  children: ReactNode;
};

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Provides a single application-level modal and controls its displayed content.
 *
 * @param props - {@link ModalProviderProps}
 * @returns Children with access to {@link useModal} and the rendered modal.
 */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: 'Placeholder title',
    content: 'Placeholder content',
  });
  const modalControls = useRef<ModalContextValue | null>(null);

  if (modalControls.current === null) {
    modalControls.current = {
      closeModal: () => {
        setIsOpen(false);
      },
      openModal: (content: ModalContent) => {
        setModalContent(content);
        setIsOpen(true);
      },
    };
  }

  const { closeModal } = modalControls.current;

  return (
    <ModalContext.Provider value={modalControls.current}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalContent.title}
        footer={modalContent.footer}
        disableOutsideClick={modalContent.disableOutsideClick}
      >
        {modalContent.content}
      </Modal>
    </ModalContext.Provider>
  );
};

/**
 * Accesses the application-level modal controls.
 *
 * @returns Functions to open and close the shared modal.
 * @throws {Error} When used outside a {@link ModalProvider}.
 */
export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error('useModal must be used within a ModalProvider.');
  }

  return context;
};
