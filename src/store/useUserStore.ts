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
  setUser: (updatedUser: AppUser) => void;
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
              upgrades: [],
            };
          } else {
            console.warn(
              "Telegram WebApp недоступен или данные пользователя не найдены. Используем моковые данные."
            );
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
              energy_updated_at: "2024-10-21T02:33:30.590Z",
              boosts_left: 6,
              boosts_updated_at: "2024-10-20T19:00:00.464Z",
              is_subscribed: true,
              morse_last_completed_at: null,
              coins: 0,
              upgrades: [
                { upgrade_id: 1, level: 8 },
                { upgrade_id: 2, level: 3 },
              ],
            };
          }

          try {
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

            // GET запрос для получения данных пользователя по его ID
            const getResponse = await axios.get<AppUser>(
              `https://dev.simatap.ru/api/users/${userData.id}`
            );

            if (getResponse.status !== 200) {
              throw new Error(
                `Ошибка при отправке GET запроса: ${getResponse.statusText}`
              );
            }

            const fetchedUserData = getResponse.data;

            // Теперь получаем количество монет
            let totalCoins = 10000; // Значение по умолчанию, если запрос вернет ошибку
            try {
              const coinsResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}api/totalCoins/${userData.id}`
              );

              if (coinsResponse.status === 200) {
                const coinsData = coinsResponse.data;
                totalCoins = coinsData.coins || totalCoins;
              } else {
                throw new Error(
                  `Ошибка при получении количества монет: ${coinsResponse.statusText}`
                );
              }
            } catch (coinError) {
              console.warn(
                "Ошибка при запросе количества монет. Используем значение по умолчанию 10,000.",
                coinError
              );
            }

            const userWithCoins: AppUser = {
              ...fetchedUserData,
              coins: totalCoins,
            };

            set({ user: userWithCoins, isLoading: false });
          } catch (fetchError) {
            console.warn(
              "Ошибка при запросе данных с сервера. Используем моковые данные.",
              fetchError
            );

            // Если запросы завершились ошибкой, используем моковые данные
            set({ user: userData, isLoading: false });
          }
        } catch (error: any) {
          console.error("Ошибка при инициализации пользователя:", error);
          toast.error(
            `Ошибка инициализации пользователя: ${
              error.response?.data?.message ||
              error.message ||
              "Неизвестная ошибка"
            }`
          );
          set({
            error: error.message || "Неизвестная ошибка",
            isLoading: false,
            user: null,
          });
        }
      },

      setUser: (updatedUser: AppUser) => {
        set({ user: updatedUser });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
