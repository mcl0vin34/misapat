import { create } from "zustand";
import photoUrl from "../assets/images/avatar.png";
import { User as AppUser } from "../types/User";

// Интерфейс состояния пользователя
interface UserState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => void;
}

// Моковые данные для разработки
const mockTelegramUser: AppUser = {
  id: 123456789,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "en",
  is_premium: false,
  photo_url: photoUrl,
};

// Создание хранилища Zustand
export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  initializeUser: () => {
    set({ isLoading: true, error: null });

    console.log("initializeUser вызван");

    // Проверяем, доступен ли Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;

    // Если Telegram WebApp недоступен, используем mock данные для разработки
    if (!tg) {
      console.warn("Telegram WebApp недоступен, используем mock данные.");

      // Используйте mock данные вместо реальных данных для разработки
      set({ user: mockTelegramUser, isLoading: false });
      return;
    }

    // Убедимся, что WebApp инициализировался
    tg.ready();
    console.log("Telegram WebApp обнаружен.");

    // Получаем initDataUnsafe
    const initDataUnsafe = tg.initDataUnsafe;
    console.log("initDataUnsafe:", initDataUnsafe);

    if (initDataUnsafe?.user) {
      const tgUser = initDataUnsafe.user;

      // Создаём объект AppUser из данных Telegram
      const appUser: AppUser = {
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name || "",
        username: tgUser.username || "",
        language_code: tgUser.language_code || "ru",
        is_premium: tgUser.is_premium || false,
        photo_url: tgUser.photo_url || photoUrl,
      };

      // Устанавливаем пользователя из initDataUnsafe
      set({ user: appUser, isLoading: false });
    } else {
      console.warn(
        "Данные пользователя отсутствуют в initDataUnsafe. Используем дефолтные данные."
      );
      set({ user: mockTelegramUser, isLoading: false });
    }
  },
}));
