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

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      initializeUser: async () => {
        set({ isLoading: true, error: null });

        try {
          const tg = (window as any).Telegram?.WebApp;
          console.log("window.Telegram:", (window as any).Telegram);
          console.log("tg:", tg);

          let userData: AppUser;

          if (tg && tg.initDataUnsafe?.user && tg.initDataUnsafe?.user?.id) {
            // Получаем данные из Telegram WebApp
            console.log("tg.initDataUnsafe.user:", tg.initDataUnsafe.user);

            userData = {
              id: tg.initDataUnsafe.user.id,
              username: tg.initDataUnsafe.user.username,
              first_name: tg.initDataUnsafe.user.first_name,
              last_name: tg.initDataUnsafe.user.last_name || "",
              language_code: tg.initDataUnsafe.user.language_code || "",
              is_premium: tg.initDataUnsafe.user.is_premium || false,
              photo_url: tg.initDataUnsafe.user.photo_url || photoUrl,
              full_name: `${tg.initDataUnsafe.user.first_name} ${
                tg.initDataUnsafe.user.last_name || ""
              }`,
              level: 1,
              created_at: "",
              energy_left: 2000,
              energy_updated_at: "",
              boosts_left: 6,
              boosts_updated_at: "",
              is_subscribed: true,
              morse_last_completed_at: null,
              coins: 0,
            };
          } else {
            console.warn(
              "Telegram WebApp недоступен или данные пользователя не найдены. Используем моковые данные."
            );
            // Используем моковые данные
            userData = {
              id: 422840434,
              username: "muamee4ever",
              first_name: "madesta",
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
              coins: 0,
            };
          }

          // Далее отправляем запросы на сервер как обычно
          // ...

          set({ user: userData, isLoading: false });
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
            user: null,
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
