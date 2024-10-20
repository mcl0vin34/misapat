// src/store/useModalStore.ts

import { create } from "zustand";

interface ModalState {
  modalStack: React.ReactNode[]; // Стек модальных окон содержит только контент
  modalBackgroundColor?: string;
  openModal: (content: React.ReactNode, backgroundColor?: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set, get) => ({
  modalStack: [],
  modalBackgroundColor: undefined,

  openModal: (content, backgroundColor) =>
    set((state) => ({
      modalStack: [...state.modalStack, content], // Добавляем контент модалки в стек
      modalBackgroundColor: backgroundColor,
    })),

  closeModal: () => {
    set((state) => {
      const newStack = [...state.modalStack];
      newStack.pop(); // Убираем последний элемент из стэка
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
