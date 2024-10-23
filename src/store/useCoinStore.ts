// src/store/useCoinStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify"; // Импортируем toast
import { AppUser } from "../types/User";
import { Upgrade } from "../types/Upgrade";
import { nanoid } from "nanoid"; // Для генерации уникальных ID

interface PendingRequest {
  resolve: () => void;
  reject: (error: string) => void;
}

interface PurchaseUpgradeResponse {
  requestId: string;
  success: boolean;
  message: string;
  upgrades: Upgrade[];
  coins: number;
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
              console.log("Store уже инициализирован.");
              return {};
            }

            const updatedState = {
              coins: user.coins || 0,
              energy: user.energy_left !== undefined ? user.energy_left : 2000,
              availableBoosters:
                user.boosts_left !== undefined ? user.boosts_left : 6,
              userId: user.id,
              upgrades: user.upgrades.map((u) => ({
                id: u.upgrade_id,
                name: "", // Заполните при получении данных бустеров
                imageUrl: "", // Заполните при получении данных бустеров
                level: u.level,
                maxLevel: 10, // Укажите реальный maxLevel
                cost: 0, // Заполните при получении данных бустеров
                rateIncreasePerLevel: 0, // Заполните при получении данных бустеров
                totalRateIncrease: 0, // Вычисляется при обновлении
              })),
              storeInitialized: true,
            };

            console.log("Store инициализирован:", updatedState);
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
            console.log("Сокет подключен.");
            socket.emit("register", { userId });
          });

          // Обработчик ответа на покупку бустера
          socket.on(
            "purchaseUpgradeResponse",
            (data: PurchaseUpgradeResponse) => {
              console.log("Получен purchaseUpgradeResponse:", data);

              const { requestId, success, message, upgrades, coins } = data;

              const pending = pendingPurchaseUpgradeRequests.get(requestId);
              if (pending) {
                if (success) {
                  console.log("Покупка бустера успешна:", requestId);
                  // Обновляем состояние монет и бустеров
                  set({
                    upgrades: upgrades.map((u) => ({
                      ...u,
                      totalRateIncrease: u.rateIncreasePerLevel * u.level,
                    })),
                    coins: coins,
                  });
                  pending.resolve();
                  // Мы не отображаем toast уведомление при успехе
                } else {
                  console.log("Ошибка покупки бустера:", message);
                  // Отображаем toast уведомление только при неудаче
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

                  pending.reject(message);
                }
                pendingPurchaseUpgradeRequests.delete(requestId);
              } else {
                console.warn(
                  "Не найдено ожидающих запросов для requestId:",
                  requestId
                );
              }
            }
          );

          // Логирование других событий сокета
          socket.on("energyUpdated", (data) => {
            console.log("Получены данные energyUpdated:", data);
            if (data.energy_left !== undefined) {
              set({ energy: data.energy_left });
            } else {
              console.warn("Обновление энергии не содержит данных:", data);
            }
          });

          socket.on("passiveIncomePerHour", (data) => {
            console.log("Получены данные passiveIncomePerHour:", data);
            if (data.passive_income_per_hour !== undefined) {
              set({ passiveIncomeRate: data.passive_income_per_hour });
              console.log(
                "passiveIncomeRate обновлен:",
                data.passive_income_per_hour
              );
            } else {
              console.warn(
                "Обновление пассивного дохода не содержит данных:",
                data
              );
            }
          });

          socket.on("boostsUpdated", (data) => {
            console.log("Получены данные boostsUpdated:", data);
            if (data.boosts_left !== undefined) {
              set({ availableBoosters: data.boosts_left });
            } else {
              console.warn("Обновление бустов не содержит данных:", data);
            }
          });

          socket.on("coinsUpdated", (data) => {
            console.log("Получены данные coinsUpdated:", data);
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
            console.log(`Пользователь ${userId} отключен от WebSocket`);
            state.reconnectSocket();
          });

          set({ socket });

          console.log("Сокет инициализирован:", socket);
        },

        reconnectSocket: () => {
          const state = get();
          if (state.socket) {
            console.log("Попытка переподключения сокета...");
            state.socket.connect();
          } else {
            console.log("Сокет не инициализирован, инициализируем заново.");
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
            console.log(`Пользователь ${userId} совершает тап.`);
            socket.emit("tap", { userId });
          } else {
            console.error("Недостаточно энергии или сокет не инициализирован.");
          }
        },

        decrementEnergy: (amount: number) => {
          // Удаляем локальное обновление энергии
        },

        disconnectSocket: () => {
          const state = get();
          const { socket } = state;
          if (socket) {
            console.log("Отключаем сокет...");
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
            console.log(
              `Отправка запроса на покупку бустера с requestId: ${requestId}`
            );

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
