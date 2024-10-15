// store/useUserStore.ts

import { create } from "zustand";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import photoUrl from "../assets/images/avatar.png";
import { User as AppUser } from "../types/User";
import { User as TgUser } from "@telegram-apps/types"; // Импортируйте тип пользователя из Telegram SDK

// Интерфейс состояния пользователя
interface UserState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => Promise<void>;
}

// Дефолтные данные пользователя
const defaultUser: AppUser = {
  id: 2281337,
  first_name: "Muamee",
  last_name: "4ever",
  username: "muamee4ever",
  language_code: "ru",
  is_premium: false,
  photo_url: photoUrl, // Путь к дефолтной аватарке
  week_total_coins: 0, // Добавлено поле, если используется
};

// Функция для отправки initDataRaw на сервер для валидации
const verifyInitData = async (initDataRaw: string): Promise<AppUser | null> => {
  try {
    const response = await fetch(
      "https://your-server.com/api/verify-init-data",
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

    if (process.env.NODE_ENV === "development") {
      // В режиме разработки используем дефолтные данные
      console.log("Используются дефолтные данные пользователя (разработка).");
      set({ user: defaultUser, isLoading: false });
      return;
    }

    // Проверяем, доступен ли Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.warn(
        "Telegram WebApp недоступен. Используем дефолтные данные пользователя."
      );
      set({ user: defaultUser, isLoading: false });
      return;
    }

    // Получаем параметры запуска из Telegram WebApp
    const { initDataRaw, initData } = retrieveLaunchParams();
    console.log("Init Data Raw:", initDataRaw);
    console.log("Init Data:", initData);

    if (!initDataRaw) {
      console.warn(
        "Init Data Raw отсутствуют. Используем дефолтные данные пользователя."
      );
      set({ user: defaultUser, isLoading: false });
      return;
    }

    // Отправляем initDataRaw на сервер для валидации и получения данных пользователя
    const verifiedUser = await verifyInitData(initDataRaw);

    if (verifiedUser) {
      set({ user: verifiedUser, isLoading: false });
      console.log("Пользователь успешно инициализирован.");
    } else {
      // Если валидация не прошла, используем дефолтные данные или обрабатываем ошибку
      console.warn(
        "Валидация init данных не прошла. Используем дефолтные данные пользователя."
      );
      set({ user: defaultUser, isLoading: false });
      set({ error: "Не удалось инициализировать данные пользователя." });
    }
  },
}));
