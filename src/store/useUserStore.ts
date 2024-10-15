import { create } from "zustand";
import { retrieveLaunchParams } from "@telegram-apps/sdk"; // предполагаемый путь к SDK
import photoUrl from "../assets/images/avatar.png";
import { User as AppUser } from "../types/User";

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

    // Проверяем доступность Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      console.warn("Telegram WebApp недоступен, используем дефолтные данные.");
      set({ user: defaultUser, isLoading: false });
      return;
    }

    // Убедимся, что WebApp инициализировался
    tg.ready();
    tg.expand();
    console.log("Telegram WebApp обнаружен.");

    // Получаем параметры запуска (initDataRaw)
    const launchParams = retrieveLaunchParams(); // Теперь это объект
    const { initDataRaw } = launchParams; // Получаем initDataRaw
    const initDataUnsafe = (launchParams as any).initDataUnsafe; // Получаем initDataUnsafe через приведение типа

    console.log("initDataRaw:", initDataRaw);
    console.log("initDataUnsafe:", initDataUnsafe);

    // Если данные пользователя присутствуют в initDataUnsafe
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

      // Если initDataRaw доступен, отправляем его на сервер для валидации
      if (initDataRaw) {
        try {
          const verifiedUser = await verifyInitData(initDataRaw);
          if (verifiedUser) {
            set({ user: verifiedUser, isLoading: false });
            console.log(
              "Пользователь успешно инициализирован и валидация прошла."
            );
            return;
          } else {
            console.warn(
              "Валидация init данных не прошла. Используем данные из initDataUnsafe."
            );
          }
        } catch (error) {
          console.error("Ошибка при отправке initDataRaw на сервер:", error);
        }
      } else {
        console.warn(
          "initDataRaw отсутствуют, используем данные из initDataUnsafe."
        );
      }

      // Устанавливаем пользователя из initDataUnsafe, если серверная валидация не прошла
      set({ user: appUser, isLoading: false });
    } else {
      // Если данные пользователя отсутствуют
      console.warn(
        "Данные пользователя отсутствуют в initDataUnsafe. Используем дефолтные данные."
      );
      set({ user: defaultUser, isLoading: false });
    }
  },
}));
