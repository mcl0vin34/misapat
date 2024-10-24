// src/store/useCoinStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { AppUser } from "../types/User";
import { Upgrade } from "../types/Upgrade";
import { nanoid } from "nanoid";

interface PendingRequest {
  resolve: () => void;
  reject: (error: string) => void;
}

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
  isPurchasing: number | null; // Новое свойство для отслеживания процесса покупки
  setUpgrades: (upgrades: Upgrade[]) => void; // Новая функция для установки апгрейдов
  initializeStore: (user: AppUser) => void;
  initializeSocket: () => void;
  sendTap: () => void;
  reconnectSocket: () => void;
  disconnectSocket: () => void;
  addCoins: () => Promise<void>;
  incrementCoins: (amount: number) => void;
  decrementEnergy: (amount: number) => void;
  activateBoost: () => void;
  purchaseUpgrade: (id: number) => Promise<void>;
  setOfflineIncome: (amount: number) => void;
  setPassiveIncomeRate: (rate: number) => void;
}

const useCoinStore = create<CoinStoreState>()(
  persist(
    (set, get) => {
      const pendingPurchaseUpgradeRequests = new Map<string, PendingRequest>();

      return {
        coins: 0,
        coinsPerClick: 13,
        passiveIncomeRate: 0,
        energy: 2000,
        maxEnergy: 2000,
        availableBoosters: 6,
        totalBoosters: 6,
        userId: null,
        storeInitialized: false,
        offlineIncome: 0,
        upgrades: [],
        socket: null,
        isPurchasing: null, // Инициализация isPurchasing
        setUpgrades: (upgrades: Upgrade[]) => set({ upgrades }), // Реализация setUpgrades

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

            console.log("Store initialized with user:", updatedState);

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

          // Обработчик ответа на покупку бустера
          socket.on("purchaseUpgradeResponse", (data) => {
            const { requestId, success, message, upgrades, coins } = data;

            const pending = pendingPurchaseUpgradeRequests.get(requestId);
            if (pending) {
              if (success) {
                // Обновляем состояние монет и бустеров
                set({
                  upgrades: upgrades, // Обновленные апгрейды от сервера
                  coins: coins, // Обновленное количество монет от сервера
                  isPurchasing: null, // Сбрасываем isPurchasing
                });
                pending.resolve();
              } else {
                // Определяем тип ошибки и отображаем соответствующий toast
                if (message === "Улучшение достигло максимального уровня.") {
                  toast("Улучшение достигло максимального уровня.", {
                    type: "info",
                    style: {
                      backgroundColor: "green",
                      color: "#fff",
                    },
                  });
                } else if (
                  message === "Недостаточно монет для покупки улучшения."
                ) {
                  toast("Недостаточно монет для покупки улучшения.", {
                    type: "error",
                    style: {
                      backgroundColor: "red",
                      color: "#fff",
                    },
                  });
                } else {
                  // Для других типов ошибок используем стандартный error toast
                  toast.error(message);
                }

                set({ isPurchasing: null }); // Сбрасываем isPurchasing
                pending.reject(message);
              }
              pendingPurchaseUpgradeRequests.delete(requestId);
            } else {
              console.warn(
                "Не найдено ожидающих запросов для requestId:",
                requestId
              );
            }
          });

          // Другие обработчики событий сокета
          socket.on("energyUpdated", (data) => {
            if (data.energy_left !== undefined) {
              set({ energy: data.energy_left });
            } else {
              console.warn("Обновление энергии не содержит данных:", data);
            }
          });

          socket.on("passiveIncomePerHour", (data) => {
            if (data.passive_income_per_hour !== undefined) {
              set({ passiveIncomeRate: data.passive_income_per_hour });
            } else {
              console.warn(
                "Обновление пассивного дохода не содержит данных:",
                data
              );
            }
          });

          socket.on("boostsUpdated", (data) => {
            if (data.boosts_left !== undefined) {
              set({ availableBoosters: data.boosts_left });
            } else {
              console.warn("Обновление бустов не содержит данных:", data);
            }
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
          });

          socket.on("disconnect", () => {
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
            socket.emit("tap", { userId });
          } else {
            console.error("Недостаточно энергии или сокет не инициализирован.");
          }
        },

        decrementEnergy: (amount: number) => {
          // Локальное обновление энергии (если требуется)
          set((state) => ({ energy: state.energy - amount }));
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
            return;
          }

          if (energy < coinsPerClick) {
            console.error("Недостаточно энергии для добавления монет.");
            return;
          }

          state.sendTap();
        },

        incrementCoins: (amount: number) => {
          set((state) => ({ coins: state.coins + amount }));
        },

        purchaseUpgrade: (id: number): Promise<void> => {
          return new Promise((resolve, reject) => {
            const state = get();
            const { socket, userId } = state;

            if (!socket || !userId) {
              console.error("Не удалось подключиться к серверу.");
              reject("Не удалось подключиться к серверу.");
              return;
            }

            const requestId = nanoid();

            // Устанавливаем isPurchasing
            set({ isPurchasing: id });

            pendingPurchaseUpgradeRequests.set(requestId, { resolve, reject });

            socket.emit("purchaseUpgrade", {
              userId,
              upgradeId: id,
              requestId,
            });
          });
        },

        setOfflineIncome: (amount: number) => {
          set({ offlineIncome: amount });
        },

        setPassiveIncomeRate: (rate: number) => {
          set({ passiveIncomeRate: rate });
        },
      };
    },
    {
      name: "coin-storage",
      partialize: (state) => ({
        coins: state.coins,
        energy: state.energy,
        passiveIncomeRate: state.passiveIncomeRate,
        availableBoosters: state.availableBoosters,
        userId: state.userId,
        storeInitialized: state.storeInitialized,
        offlineIncome: state.offlineIncome,
      }),
    }
  )
);

export default useCoinStore;
