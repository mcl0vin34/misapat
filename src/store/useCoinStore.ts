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
  activateBooster: () => void;
  purchaseUpgrade: (id: number) => void;
  setOfflineIncome: (amount: number) => void;
  setPassiveIncomeRate: (rate: number) => void;
  startPassiveIncome: () => void;
  stopPassiveIncome: () => void;
  startEnergyRecovery: () => void;
  stopEnergyRecovery: () => void;
  calculateOfflineIncome: () => void;
  calculateEnergyRestoration: () => void;
  setLastActiveTime: (timestamp: number) => void;
}

const initialUpgrades: Upgrade[] = [
  {
    id: 1,
    name: "Ларёк с шаурмой",
    imageUrl: "/images/shaurma.png",
    level: 0,
    maxLevel: 10,
    cost: 10,
    rateIncreasePerLevel: 3,
    totalRateIncrease: 0,
  },
  {
    id: 2,
    name: "Магазин сувениров",
    imageUrl: "/images/souvenirs.png",
    level: 0,
    maxLevel: 15,
    cost: 50,
    rateIncreasePerLevel: 5,
    totalRateIncrease: 0,
  },
  // Добавьте остальные улучшения здесь
];

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
      upgrades: initialUpgrades,
      socket: null,

      initializeStore: (user: AppUser) => {
        set((state) => {
          if (state.storeInitialized) {
            return {};
          }
          return {
            coins: user.coins || 0,
            energy: user.energy_left,
            availableBoosters: user.boosts_left,
            userId: user.id,
            storeInitialized: true,
          };
        });
        get().initializeSocket(); // Правильный вызов метода
      },

      initializeSocket: () => {
        const state = get();
        const { userId } = state;

        if (!userId) {
          console.error(
            "Не удалось получить userId для подключения к WebSocket."
          );
          return;
        }

        const socket = io("http://212.233.79.35:7860", {
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
        });

        socket.on("connect", () => {
          console.log(`Пользователь ${userId} подключен к WebSocket`);
          socket.emit("register", { userId });
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

        socket.on("energyUpdated", (data) => {
          console.log(`Энергия обновлена:`, data);
          set({ energy: data.energyLeft });
        });

        socket.on("coinsUpdated", (data) => {
          console.log(`Монеты обновлены:`, data);
          set({ coins: data.coins });
        });

        socket.on("tapError", (error) => {
          console.error(`Ошибка при тапе:`, error);
          toast.error(`Ошибка при тапе: ${error.message}`);
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

      sendTap: () => {
        const state = get();
        const { socket, userId } = state;

        if (socket && userId) {
          console.log(`Отправка события "tap" для пользователя ${userId}`);
          socket.emit("tap", { userId });
        } else {
          console.error(
            "Сокет не инициализирован или пользователь не авторизован."
          );
        }
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
        set((state) => ({
          coins: state.coins + amount,
        }));
      },

      setOfflineIncome: (amount: number) => {
        set({ offlineIncome: amount });
      },

      setPassiveIncomeRate: (rate: number) => {
        set({ passiveIncomeRate: rate });
      },

      purchaseUpgrade: (id: number) => {
        const state = get();
        const upgrade = state.upgrades.find((u) => u.id === id);
        if (
          upgrade &&
          state.coins >= upgrade.cost &&
          upgrade.level < upgrade.maxLevel
        ) {
          const newLevel = upgrade.level + 1;
          const newTotalRateIncrease = upgrade.rateIncreasePerLevel * newLevel;
          const newCost = Math.round(upgrade.cost * 2);

          set((state) => ({
            coins: state.coins - upgrade.cost,
            upgrades: state.upgrades.map((u) =>
              u.id === id
                ? {
                    ...u,
                    level: newLevel,
                    cost: newCost,
                    totalRateIncrease: newTotalRateIncrease,
                  }
                : u
            ),
          }));
          toast.success(`${upgrade.name} улучшен до уровня ${newLevel}`);
        } else {
          toast.error("Недостаточно монет или максимальный уровень достигнут.");
        }
      },

      activateBooster: () => {
        const state = get();
        if (state.availableBoosters > 0) {
          set({
            availableBoosters: state.availableBoosters - 1,
          });
          toast.success("Бустер активирован!");
        } else {
          toast.error("Нет доступных бустеров.");
        }
      },

      startPassiveIncome: () => {
        console.log("Начало пассивного дохода.");
      },

      stopPassiveIncome: () => {
        console.log("Пассивный доход остановлен.");
      },

      startEnergyRecovery: () => {
        console.log("Начато восстановление энергии.");
      },

      stopEnergyRecovery: () => {
        console.log("Восстановление энергии остановлено.");
      },

      calculateOfflineIncome: () => {
        console.log("Расчёт оффлайн дохода.");
      },

      calculateEnergyRestoration: () => {
        console.log("Расчёт восстановления энергии.");
      },

      setLastActiveTime: (timestamp: number) => {
        console.log(`Последняя активность: ${timestamp}`);
      },
    }),
    {
      name: "coin-storage",
      partialize: (state) => ({
        coins: state.coins,
        energy: state.energy,
        userId: state.userId,
        storeInitialized: state.storeInitialized,
        offlineIncome: state.offlineIncome,
        upgrades: state.upgrades,
      }),
    }
  )
);

export default useCoinStore;
