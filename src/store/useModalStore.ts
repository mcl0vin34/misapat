import { create } from "zustand";

interface ModalState {
  modalStack: Array<{ content: React.ReactNode; backgroundColor?: string }>; // Теперь стек содержит объекты с контентом и цветом
  openModal: (content: React.ReactNode, backgroundColor?: string) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  modalStack: [],

  openModal: (content, backgroundColor) =>
    set((state) => ({
      modalStack: [
        ...state.modalStack,
        { content, backgroundColor }, // Сохраняем контент и цвет фона вместе
      ],
    })),

  closeModal: () => {
    set((state) => {
      const newStack = [...state.modalStack];
      newStack.pop(); // Убираем последний элемент из стека
      return {
        modalStack: newStack,
      };
    });
  },
}));

export default useModalStore;
