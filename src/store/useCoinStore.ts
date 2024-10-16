// src/store/useCoinStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { CoinResponse } from "../types/CoinResponse";
import { AppUser } from "../types/User";
import { toast } from "react-toastify";

interface Upgrade {
  id: number;
  name: string;
  baseCost: number;
  cost: number;
  baseRateIncrease: number;
  rateIncreasePerLevel: number;
  totalRateIncrease: number;
  level: number;
  maxLevel: number;
}

interface Booster {
  id: number;
  name: string;
  duration: number;
  effectMultiplier: number;
}

interface CoinStoreState {
  coins: number;
  coinsPerClick: number;
  passiveIncomeRate: number;
  energy: number;
  maxEnergy: number;
  availableBoosters: number;
  totalBoosters: number;
  activeBoosters: Booster[];
  upgrades: Upgrade[];
  lastActiveTime: number | null;
  offlineIncome: number;
  userId: number | null;
  storeInitialized: boolean;
  setOfflineIncome: (amount: number) => void;
  incrementCoins: (amount: number) => void;
  decrementEnergy: (amount: number) => void;
  restoreEnergy: () => void;
  restoreMaxEnergy: () => void;
  setCoinsPerClick: (amount: number) => void;
  activateBooster: () => Promise<void>; // Изменили типизацию
  purchaseUpgrade: (id: number) => void;
  setPassiveIncomeRate: (rate: number) => void;
  applyBooster: (booster: Booster) => void;
  removeBooster: (id: number) => void;
  startPassiveIncome: () => void;
  stopPassiveIncome: () => void;
  startEnergyRecovery: () => void;
  stopEnergyRecovery: () => void;
  setLastActiveTime: (timestamp: number) => void;
  calculateOfflineIncome: () => void;
  calculateEnergyRestoration: () => void;
  addCoins: () => Promise<void>;
  initializeStore: (user: AppUser) => void;
}

const useCoinStore = create<CoinStoreState>()(
  persist(
    (set, get) => {
      let intervalId: NodeJS.Timeout | null = null;
      let energyRecoveryId: NodeJS.Timeout | null = null;

      const savedPassiveIncomeRate = localStorage.getItem("passiveIncomeRate");
      const savedUpgrades = localStorage.getItem("upgrades");
      const savedLastActiveTime = localStorage.getItem("lastActiveTime");

      const costMultiplier = 2.3;

      const initialUpgrades: Upgrade[] = savedUpgrades
        ? JSON.parse(savedUpgrades)
        : [
            {
              id: 1,
              name: "Ларёк с шаурмой",
              baseCost: 10,
              cost: 10,
              baseRateIncrease: 3,
              rateIncreasePerLevel: 3,
              totalRateIncrease: 0,
              level: 0,
              maxLevel: 10,
            },
            // Добавьте остальные улучшения здесь
          ];

      const calculatePassiveIncome = (upgrades: Upgrade[]): number => {
        return upgrades.reduce(
          (total, upgrade) => total + upgrade.totalRateIncrease,
          0
        );
      };

      return {
        coins: 0, // Будет установлено в initializeStore
        coinsPerClick: 13,
        passiveIncomeRate: savedPassiveIncomeRate
          ? Number(savedPassiveIncomeRate)
          : 0,
        energy: 0, // Будет установлено в initializeStore
        maxEnergy: 2000,
        availableBoosters: 6, // Будет обновлено в initializeStore
        totalBoosters: 6,
        activeBoosters: [],
        upgrades: initialUpgrades,
        lastActiveTime: savedLastActiveTime
          ? Number(savedLastActiveTime)
          : null,
        offlineIncome: 0,
        userId: null,
        storeInitialized: false,

        initializeStore: (user: AppUser) => {
          const state = get();
          if (state.storeInitialized) {
            return; // Уже инициализировано
          }
          set({
            coins: user.coins || 0, // Устанавливаем монеты из данных пользователя
            energy: user.energy_left,
            availableBoosters: user.boosts_left,
            userId: user.id,
            storeInitialized: true,
          });
        },

        setOfflineIncome: (amount: number) => {
          set(() => ({ offlineIncome: amount }));
        },

        incrementCoins: (amount: number) => {
          set((state: CoinStoreState) => {
            const newCoins = state.coins + amount;
            return { coins: newCoins };
          });
        },

        decrementEnergy: (amount: number) => {
          set((state: CoinStoreState) => {
            if (state.energy >= amount) {
              return { energy: state.energy - amount };
            }
            return state;
          });
        },

        restoreEnergy: () => {
          set((state: CoinStoreState) => {
            const newEnergy = Math.min(state.energy + 2, state.maxEnergy);
            return { energy: newEnergy };
          });
        },

        restoreMaxEnergy: () => {
          set((state: CoinStoreState) => ({ energy: state.maxEnergy }));
        },

        setCoinsPerClick: (amount: number) => {
          set(() => ({ coinsPerClick: amount }));
        },

        activateBooster: async () => {
          const state = get();
          if (state.availableBoosters > 0) {
            const { userId } = state;
            if (!userId) {
              console.error("Пользователь не авторизован.");
              toast.error("Пользователь не авторизован.");
              return;
            }

            try {
              const response = await axios.post(
                `${process.env.REACT_APP_API_URL}api/boosts/use-boost`,
                {},
                {
                  params: { userId },
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const data = response.data;

              // Обновляем состояние на основе ответа сервера
              set({
                availableBoosters: data.boostsLeft,
                energy: data.energyLeft,
              });

              toast.success("Бустер успешно использован!");
            } catch (error: any) {
              console.error(
                "Ошибка при использовании бустера:",
                error.response?.data?.message || error.message
              );
              toast.error(
                `Ошибка при использовании бустера: ${
                  error.response?.data?.message || error.message
                }`
              );
            }
          } else {
            toast.error("У вас нет доступных бустеров.");
          }
        },

        setPassiveIncomeRate: (rate: number) => {
          set(() => {
            localStorage.setItem("passiveIncomeRate", rate.toString());
            return { passiveIncomeRate: rate };
          });
        },

        purchaseUpgrade: (id: number) => {
          const state = get();
          const { coins, upgrades } = state;
          const upgrade = upgrades.find((u) => u.id === id);

          if (upgrade) {
            if (upgrade.level >= upgrade.maxLevel) {
              toast.info("Улучшение достигло максимального уровня.");
              return;
            }
            if (coins >= upgrade.cost) {
              const newCoins = coins - upgrade.cost;
              const newLevel = upgrade.level + 1;

              const newUpgrades = upgrades.map((u) =>
                u.id === id
                  ? {
                      ...u,
                      level: newLevel,
                      totalRateIncrease: u.rateIncreasePerLevel * newLevel,
                      cost: Math.round(
                        u.baseCost * Math.pow(costMultiplier, newLevel)
                      ),
                    }
                  : u
              );

              const newPassiveIncome = calculatePassiveIncome(newUpgrades);
              set({ coins: newCoins, upgrades: newUpgrades });
              state.setPassiveIncomeRate(newPassiveIncome);

              // Сохранение улучшений в localStorage
              localStorage.setItem("upgrades", JSON.stringify(newUpgrades));

              toast.success(`Улучшение ${upgrade.name} приобретено!`);

              // Отправка обновленных данных на бэкенд
              const { userId } = state;
              if (userId) {
                axios.post(
                  `${process.env.REACT_APP_API_URL}api/users/${userId}/update-coins`,
                  {
                    coins: newCoins,
                  }
                );
              }
            } else {
              toast.error("Недостаточно монет для покупки этого улучшения.");
            }
          }
        },

        applyBooster: (booster: Booster) => {
          set((state: CoinStoreState) => ({
            activeBoosters: [...state.activeBoosters, booster],
          }));

          setTimeout(() => {
            const state = get();
            state.removeBooster(booster.id);
          }, booster.duration * 1000);
        },

        removeBooster: (id: number) => {
          set((state: CoinStoreState) => ({
            activeBoosters: state.activeBoosters.filter((b) => b.id !== id),
          }));
        },

        startPassiveIncome: () => {
          if (intervalId !== null) {
            clearInterval(intervalId);
          }
          intervalId = setInterval(() => {
            set((state: CoinStoreState) => {
              const boosterMultiplier = state.activeBoosters.reduce(
                (acc: number, booster: Booster) =>
                  acc * booster.effectMultiplier,
                1
              );
              const incomePerSecond =
                (state.passiveIncomeRate / 3600) * boosterMultiplier;
              const newCoins = state.coins + incomePerSecond;
              return { coins: newCoins };
            });
          }, 1000);
        },

        stopPassiveIncome: () => {
          if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
          }
        },

        startEnergyRecovery: () => {
          if (energyRecoveryId !== null) {
            clearInterval(energyRecoveryId);
          }
          energyRecoveryId = setInterval(() => {
            const state = get();
            state.restoreEnergy();
          }, 1000);
        },

        stopEnergyRecovery: () => {
          if (energyRecoveryId !== null) {
            clearInterval(energyRecoveryId);
            energyRecoveryId = null;
          }
        },

        setLastActiveTime: (timestamp: number) => {
          set(() => {
            localStorage.setItem("lastActiveTime", timestamp.toString());
            return { lastActiveTime: timestamp };
          });
        },

        calculateOfflineIncome: () => {
          const state = get();
          const {
            lastActiveTime,
            passiveIncomeRate,
            incrementCoins,
            setOfflineIncome,
          } = state;
          if (lastActiveTime !== null) {
            const currentTime = Date.now();
            const timeDifference = (currentTime - lastActiveTime) / 1000;

            const maxTime = 3 * 60 * 60;
            const effectiveTime = Math.min(timeDifference, maxTime);

            const offlineIncome = (passiveIncomeRate / 3600) * effectiveTime;

            incrementCoins(offlineIncome);
            setOfflineIncome(offlineIncome);
          }
        },

        calculateEnergyRestoration: () => {
          const state = get();
          const { lastActiveTime, maxEnergy, energy, setLastActiveTime } =
            state;
          if (lastActiveTime !== null) {
            const currentTime = Date.now();
            const timeDifference = (currentTime - lastActiveTime) / 1000;
            const restoredEnergy = Math.floor(timeDifference * 2);
            const newEnergy = Math.min(energy + restoredEnergy, maxEnergy);

            set({ energy: newEnergy });
            setLastActiveTime(currentTime);
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

          try {
            const response = await axios.post<CoinResponse>(
              `${process.env.REACT_APP_API_URL}api/coins/add-coins`,
              {},
              {
                params: { userId, amount: coinsPerClick },
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const data = response.data;

            set({
              coins: data.totalCoins,
              energy: data.energyLeft,
            });
          } catch (error: any) {
            console.error(
              "Ошибка при добавлении монет:",
              error.response?.data?.message || error.message
            );
            toast.error(
              `Ошибка при добавлении монет: ${
                error.response?.data?.message || error.message
              }`
            );
          }
        },
      };
    },
    {
      name: "coin-storage",
      partialize: (state) => ({
        passiveIncomeRate: state.passiveIncomeRate,
        upgrades: state.upgrades,
        lastActiveTime: state.lastActiveTime,
      }),
    }
  )
);

export default useCoinStore;
