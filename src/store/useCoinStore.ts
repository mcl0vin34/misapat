// src/store/useCoinStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { AppUser } from "../types/User";
import { Upgrade } from "../types/Upgrade";

interface CoinStoreState {
  coins: number;
  coinsPerClick: number;
  passiveIncomeRate: number;
  energy: number;
  maxEnergy: number;
  availableBoosters: number;
  totalBoosters: number;
  userId: number | null;
  storeInitialized: boolean;
  offlineIncome: number;
  upgrades: Upgrade[];
  socket: Socket | null;
  initializeStore: (user: AppUser) => void;
  initializeSocket: () => void;
  sendTap: () => void;
  reconnectSocket: () => void;
  disconnectSocket: () => void;
  addCoins: () => Promise<void>;
  incrementCoins: (amount: number) => void;
  decrementEnergy: (amount: number) => void;
  activateBoost: () => void;
  purchaseUpgrade: (id: number) => void;
  setOfflineIncome: (amount: number) => void;
  setPassiveIncomeRate: (rate: number) => void;
}

const useCoinStore = create<CoinStoreState>()(
  persist(
    (set, get) => ({
      coins: 0,
      coinsPerClick: 13,
      passiveIncomeRate: 0,
      energy: 0,
      maxEnergy: 2000,
      availableBoosters: 6,
      totalBoosters: 6,
      userId: null,
      storeInitialized: false,
      offlineIncome: 0,
      upgrades: [],
      socket: null,

      // Инициализация Store
      initializeStore: (user: AppUser) => {
        set((state) => {
          if (state.storeInitialized) {
            return {};
          }

          const updatedState = {
            coins: user.coins || 0,
            energy: user.energy_left !== undefined ? user.energy_left : 2000,
            availableBoosters:
              user.boosts_left !== undefined ? user.boosts_left : 6,
            userId: user.id,
            storeInitialized: true,
          };

          return updatedState;
        });

        const currentState = get();

        currentState.initializeSocket();
      },

      // Инициализация сокета
      initializeSocket: () => {
        const state = get();
        const { userId } = state;

        if (!userId) {
          console.error(
            "Не удалось получить userId для подключения к WebSocket."
          );
          return;
        }

        const socket = io("wss://dev.simatap.ru", {
          path: "/socket.io",
          transports: ["websocket"],
          withCredentials: true,
        });

        socket.on("connect", () => {
          socket.emit("register", { userId });
        });

        socket.on("energyUpdated", (data) => {
          if (data.energy_left !== undefined) {
            set({ energy: data.energy_left });
          } else {
            console.warn("Обновление энергии не содержит данных:", data);
          }
        });

        //socket.on("weeklyCoinsUpdated", (data) => {
        //  console.log("Обновлены weeklyCoins:", data);
        //});

        socket.on("boostsUpdated", (data) => {
          if (data.boosts_left !== undefined) {
            set({ availableBoosters: data.boosts_left });
          } else {
            console.warn("Обновление бустов не содержит данных:", data);
          }
        });

        socket.on("boostError", (error) => {
          console.error("Ошибка при использовании буста:", error);
          toast.error(`Ошибка при использовании буста: ${error.message}`);
        });

        socket.on("coinsUpdated", (data) => {
          if (data.coins !== undefined) {
            set({ coins: data.coins });
          } else {
            console.warn("Обновление монет не содержит данных:", data);
          }
        });

        socket.on("connect_error", (error) => {
          console.error(
            `Ошибка подключения WebSocket для пользователя ${userId}:`,
            error
          );
          toast.error(
            "Ошибка подключения к серверу. Попытка переподключения..."
          );
        });

        socket.on("disconnect", () => {
          console.log(`Пользователь ${userId} отключен от WebSocket`);
          toast.info(
            "Соединение с сервером потеряно. Попытка переподключения..."
          );
          state.reconnectSocket();
        });

        set({ socket });
      },

      reconnectSocket: () => {
        const state = get();
        if (state.socket) {
          state.socket.connect();
        } else {
          state.initializeSocket();
        }
      },

      // Использование буста
      activateBoost: () => {
        const state = get();
        const { socket, userId } = state;

        if (socket && userId) {
          console.log(`Пользователь ${userId} использует буст.`);
          socket.emit("useBoost", { userId });
        } else {
          console.error(
            "Не удалось использовать буст: сокет не подключен или userId не установлен."
          );
          toast.error("Не удалось использовать буст.");
        }
      },

      sendTap: () => {
        const state = get();
        const { socket, userId, coinsPerClick, energy } = state;

        if (socket && userId && energy >= coinsPerClick) {
          console.log("Отправка события 'tap' для пользователя", userId);
          console.log("Данные перед отправкой 'tap':", {
            userId,
            coinsPerClick,
            energy,
          });
          socket.emit("tap", { userId });
        } else {
          console.error("Недостаточно энергии или сокет не инициализирован.");
          toast.error("Недостаточно энергии для отправки события 'tap'.");
        }
      },

      decrementEnergy: (amount: number) => {
        // Удаляем локальное обновление энергии
      },

      disconnectSocket: () => {
        const state = get();
        const { socket } = state;
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },

      addCoins: async () => {
        const state = get();
        const { coinsPerClick, userId, energy } = state;

        if (!userId) {
          console.error("Пользователь не авторизован.");
          toast.error("Пользователь не авторизован.");
          return;
        }

        if (energy < coinsPerClick) {
          console.error("Недостаточно энергии для добавления монет.");
          toast.error("Недостаточно энергии для добавления монет.");
          return;
        }

        state.sendTap();
      },

      incrementCoins: (amount: number) => {
        // Можно удалить или оставить для других целей
      },

      purchaseUpgrade: (id: number) => {
        console.log(`Покупка улучшения с id: ${id}`);
      },

      setOfflineIncome: (amount: number) => {
        set({ offlineIncome: amount });
      },

      setPassiveIncomeRate: (rate: number) => {
        set({ passiveIncomeRate: rate });
      },
    }),
    {
      name: "coin-storage",
      partialize: (state) => ({
        coins: state.coins,
        energy: state.energy,
        availableBoosters: state.availableBoosters, // Добавлено для сохранения бустеров
        userId: state.userId,
        storeInitialized: state.storeInitialized,
        offlineIncome: state.offlineIncome,
      }),
    }
  )
);

export default useCoinStore;
