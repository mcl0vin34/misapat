// src/store/useModalStore.ts
import { create } from "zustand";

interface ModalState {
  isModalOpen: boolean;
  modalContent: JSX.Element | null;
  modalBackgroundColor?: string;
  openModal: (content: JSX.Element, backgroundColor?: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  modalBackgroundColor: undefined,
  openModal: (content, backgroundColor) =>
    set({
      isModalOpen: true,
      modalContent: content,
      modalBackgroundColor: backgroundColor,
    }),
  closeModal: () =>
    set({
      isModalOpen: false,
      modalContent: null,
      modalBackgroundColor: undefined,
    }),
}));

export default useModalStore;
