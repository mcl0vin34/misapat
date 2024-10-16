// src/store/useUserStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import photoUrl from "../assets/images/avatar.png";
import { AppUser } from "../types/User";
import axios from "axios";
import { toast } from "react-toastify";

interface UserState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  initializeUser: () => Promise<void>;
}

// src/store/useUserStore.ts

const mockTelegramUser: AppUser = {
  id: 228228137,
  username: "testuser",
  first_name: "Test",
  last_name: "User",
  language_code: "en",
  is_premium: false,
  photo_url: photoUrl,
  full_name: "Test User",
  level: 1,
  created_at: "2024-09-26T01:40:17.811Z",
  energy_left: 2000,
  energy_updated_at: "2024-10-16T06:01:02.943Z",
  boosts_left: 6,
  boosts_updated_at: "2024-10-16T05:02:42.888Z",
  is_subscribed: true,
  morse_last_completed_at: null,
  coins: 0, // Добавили поле 'coins' со значением по умолчанию
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      initializeUser: async () => {
        set({ isLoading: true, error: null });

        try {
          const isProduction = process.env.NODE_ENV === "production";

          let userData: AppUser;

          if (isProduction) {
            // Получаем данные из Telegram WebApp в продакшене
            const tg = (window as any).Telegram?.WebApp;
            // src/store/useUserStore.ts

            if (tg && tg.initDataUnsafe?.user) {
              userData = {
                id: tg.initDataUnsafe.user.id,
                username: tg.initDataUnsafe.user.username,
                first_name: tg.initDataUnsafe.user.first_name,
                last_name: tg.initDataUnsafe.user.last_name || "",
                language_code: tg.initDataUnsafe.user.language_code || "",
                is_premium: tg.initDataUnsafe.user.is_premium || false,
                photo_url: photoUrl,
                // Дополнительные поля
                full_name: "",
                level: 1,
                created_at: "",
                energy_left: 2000,
                energy_updated_at: "",
                boosts_left: 6,
                boosts_updated_at: "",
                is_subscribed: true,
                morse_last_completed_at: null,
                coins: 0, // Добавили 'coins' со значением по умолчанию
              };
            } else {
              console.warn(
                "Telegram WebApp недоступен или ID пользователя не найден."
              );
              throw new Error("Не удалось получить ID пользователя.");
            }
          } else {
            // Используем моковые данные в режиме разработки
            console.log(
              "Использование моковых данных для пользователя (development)."
            );
            userData = mockTelegramUser;
          }

          // POST запрос для создания или обновления пользователя
          const postResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}api/users`,
            {},
            {
              params: {
                id: userData.id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name || "",
              },
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (postResponse.status !== 200) {
            throw new Error(
              `Ошибка при отправке POST запроса: ${postResponse.statusText}`
            );
          }

          // GET запрос для получения обновлённых данных пользователя
          const getResponse = await axios.get<AppUser>(
            `${process.env.REACT_APP_API_URL}api/users/${userData.id}`
          );

          if (getResponse.status !== 200) {
            throw new Error(
              `Ошибка при отправке GET запроса: ${getResponse.statusText}`
            );
          }

          const fetchedUserData = getResponse.data;

          // Проверяем, что энергия получена с бэкенда
          if (fetchedUserData.energy_left === undefined) {
            throw new Error("Данные об энергии не получены с бэкенда.");
          }

          // Теперь получаем количество монет
          const coinsResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}api/totalCoins/${userData.id}`
          );

          if (coinsResponse.status !== 200) {
            throw new Error(
              `Ошибка при получении количества монет: ${coinsResponse.statusText}`
            );
          }

          const coinsData = coinsResponse.data;
          const totalCoins = coinsData.coins || 0;

          // Обновляем данные пользователя с количеством монет
          const userWithCoins: AppUser = {
            ...fetchedUserData,
            coins: totalCoins,
          };

          set({ user: userWithCoins, isLoading: false });
        } catch (error: any) {
          console.error("Ошибка при инициализации пользователя:", error);
          toast.error(
            `Ошибка инициализации пользователя: ${
              error.message || "Неизвестная ошибка"
            }`
          );
          set({
            error: error.message || "Неизвестная ошибка",
            isLoading: false,
            user: mockTelegramUser, // Используем моковые данные при ошибке
          });
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
