// src/store/useModalStore.ts

import { create } from "zustand";

interface ModalState {
  modalStack: JSX.Element[]; // Стек модальных окон
  modalBackgroundColor?: string;
  openModal: (content: JSX.Element, backgroundColor?: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set, get) => ({
  modalStack: [],
  modalBackgroundColor: undefined,

  openModal: (content, backgroundColor) =>
    set((state) => ({
      modalStack: [...state.modalStack, content], // Добавляем модалку в стек
      modalBackgroundColor: backgroundColor,
    })),

  closeModal: () => {
    set((state) => {
      const newStack = [...state.modalStack];
      newStack.pop(); // Убираем последнюю модалку из стека
      return {
        modalStack: newStack,
        modalBackgroundColor: newStack.length
          ? state.modalBackgroundColor
          : undefined,
      };
    });
  },
}));

export default useModalStore;
