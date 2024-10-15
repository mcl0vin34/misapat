// store/useUserStore.ts

import { create } from "zustand";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import photoUrl from "../assets/images/avatar.png";
import { User as AppUser } from "../types/User";
import tg from "../utils/tg"; // Убедитесь, что путь корректный

// Интерфейс состояния пользователя
interface UserState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => Promise<void>;
}

// Дефолтные данные пользователя для режима разработки
const defaultUser: AppUser = {
  id: 2281337,
  first_name: "Muamee",
  last_name: "4ever",
  username: "test_user",
  language_code: "ru",
  is_premium: false,
  photo_url: photoUrl, // Путь к дефолтной аватарке
};

// Функция для отправки initDataRaw на сервер для валидации
const verifyInitData = async (initDataRaw: string): Promise<AppUser | null> => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL
        ? `${process.env.REACT_APP_API_URL}/verify-init-data`
        : "https://your-server.com/api/verify-init-data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `tma ${initDataRaw}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при валидации init данных на сервере.");
    }

    const data = await response.json();

    // Предполагается, что сервер возвращает объект пользователя после успешной валидации
    return data.user as AppUser;
  } catch (error) {
    console.error("Ошибка верификации init данных:", error);
    return null;
  }
};

// Создание хранилища Zustand
export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  initializeUser: async () => {
    set({ isLoading: true, error: null });

    console.log("initializeUser вызван");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("tg:", tg);
    console.log("tg.initDataUnsafe:", tg?.initDataUnsafe);

    // Проверяем, доступен ли Telegram WebApp и содержит ли initDataUnsafe данные пользователя
    if (tg?.initDataUnsafe?.user) {
      console.log("Telegram WebApp обнаружен с данными пользователя");
      const tgUser = tg.initDataUnsafe.user;

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

      // Получаем initDataRaw для отправки на сервер
      const { initDataRaw } = retrieveLaunchParams();

      console.log("initDataRaw:", initDataRaw);

      if (initDataRaw) {
        // Отправляем initDataRaw на сервер для валидации
        const verifiedUser = await verifyInitData(initDataRaw);

        if (verifiedUser) {
          // Если валидация успешна, используем данные с сервера
          set({ user: verifiedUser, isLoading: false });
          console.log(
            "Пользователь успешно инициализирован и валидация прошла."
          );
        } else {
          // Если валидация не прошла, используем данные из initDataUnsafe
          console.warn(
            "Валидация init данных не прошла, используем данные из initDataUnsafe."
          );
          set({ user: appUser, isLoading: false });
        }
      } else {
        // Если initDataRaw отсутствует, используем данные из initDataUnsafe
        console.warn(
          "initDataRaw отсутствуют, используем данные из initDataUnsafe."
        );
        set({ user: appUser, isLoading: false });
      }
    } else if (process.env.NODE_ENV === "development") {
      // Если Telegram WebApp недоступен и режим разработки, используем defaultUser
      console.log("Используются дефолтные данные пользователя (разработка).");
      set({ user: defaultUser, isLoading: false });
    } else {
      // Если Telegram WebApp недоступен и режим продакшена, можно установить ошибку или перенаправить пользователя
      console.warn(
        "Telegram WebApp недоступен. Используем дефолтные данные пользователя."
      );
      set({ user: defaultUser, isLoading: false });
      // Опционально:
      // set({ error: "Telegram WebApp недоступен." });
    }
  },
}));
