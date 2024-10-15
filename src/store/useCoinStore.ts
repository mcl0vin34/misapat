import { create } from "zustand";

interface Upgrade {
  id: number;
  name: string;
  baseCost: number;
  cost: number;
  baseRateIncrease: number;
  rateIncreasePerLevel: number; // Доход на уровень
  totalRateIncrease: number; // Общий доход от улучшения
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
  setOfflineIncome: (amount: number) => void;
  incrementCoins: (amount: number) => void;
  decrementEnergy: (amount: number) => void;
  restoreEnergy: () => void;
  restoreMaxEnergy: () => void;
  setCoinsPerClick: (amount: number) => void;
  activateBooster: () => void;
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
  calculateEnergyRestoration: () => void; // Добавляем метод восстановления энергии
}

const useCoinStore = create<CoinStoreState>((set, get) => {
  let intervalId: NodeJS.Timeout | null = null;
  let energyRecoveryId: NodeJS.Timeout | null = null;

  // Загрузка начальных данных из localStorage
  const savedCoins = localStorage.getItem("coins");
  const savedPassiveIncomeRate = localStorage.getItem("passiveIncomeRate");
  const savedUpgrades = localStorage.getItem("upgrades");
  const savedLastActiveTime = localStorage.getItem("lastActiveTime");

  // Множитель для роста стоимости
  const costMultiplier = 2.3;

  const initialUpgrades: Upgrade[] = savedUpgrades
    ? JSON.parse(savedUpgrades)
    : [
        // Ваши улучшения здесь...
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
        // Добавьте остальные улучшения аналогичным образом
      ];

  const calculatePassiveIncome = (upgrades: Upgrade[]): number => {
    return upgrades.reduce(
      (total, upgrade) => total + upgrade.totalRateIncrease,
      0
    );
  };

  return {
    coins: savedCoins ? Number(savedCoins) : 0,
    coinsPerClick: 13, // Начальное количество монет за клик
    passiveIncomeRate: savedPassiveIncomeRate
      ? Number(savedPassiveIncomeRate)
      : 0,
    energy: 2000,
    maxEnergy: 2000,
    availableBoosters: 6,
    totalBoosters: 6,
    activeBoosters: [],
    upgrades: initialUpgrades,
    lastActiveTime: savedLastActiveTime ? Number(savedLastActiveTime) : null,
    offlineIncome: 0,

    setOfflineIncome: (amount: number) => {
      set(() => ({ offlineIncome: amount }));
    },

    incrementCoins: (amount: number) => {
      set((state) => {
        const newCoins = state.coins + amount;
        localStorage.setItem("coins", newCoins.toString());
        return { coins: newCoins };
      });
    },

    decrementEnergy: (amount: number) => {
      set((state) => {
        if (state.energy >= amount) {
          return { energy: state.energy - amount };
        }
        return state; // Если энергии недостаточно, возвращаем текущее состояние без изменений
      });
    },

    restoreEnergy: () => {
      set((state) => {
        const newEnergy = Math.min(state.energy + 2, state.maxEnergy);
        return { energy: newEnergy };
      });
    },

    restoreMaxEnergy: () => {
      set((state) => {
        return { energy: state.maxEnergy };
      });
    },

    setCoinsPerClick: (amount: number) => {
      set(() => ({ coinsPerClick: amount }));
    },

    activateBooster: () => {
      const { availableBoosters, restoreMaxEnergy } = get();
      if (availableBoosters > 0) {
        set((state) => {
          restoreMaxEnergy();
          return { availableBoosters: state.availableBoosters - 1 };
        });
      }
    },

    setPassiveIncomeRate: (rate: number) => {
      set(() => {
        localStorage.setItem("passiveIncomeRate", rate.toString());
        return { passiveIncomeRate: rate };
      });
    },

    purchaseUpgrade: (id: number) => {
      const { coins, upgrades } = get();
      const upgrade = upgrades.find((u) => u.id === id);

      if (upgrade) {
        if (upgrade.level >= upgrade.maxLevel) {
          // Улучшение достигло максимального уровня
          return;
        }
        if (coins >= upgrade.cost) {
          set((state) => {
            const newCoins = state.coins - upgrade.cost;
            const newLevel = upgrade.level + 1;

            const newUpgrades = state.upgrades.map((u) =>
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
            get().setPassiveIncomeRate(newPassiveIncome);

            localStorage.setItem("coins", newCoins.toString());
            localStorage.setItem("upgrades", JSON.stringify(newUpgrades));

            return { coins: newCoins, upgrades: newUpgrades };
          });
        }
      }
    },

    applyBooster: (booster: Booster) => {
      set((state) => {
        const newBoosters = [...state.activeBoosters, booster];
        return { activeBoosters: newBoosters };
      });

      setTimeout(() => {
        get().removeBooster(booster.id);
      }, booster.duration * 1000);
    },

    removeBooster: (id: number) => {
      set((state) => {
        const newBoosters = state.activeBoosters.filter((b) => b.id !== id);
        return { activeBoosters: newBoosters };
      });
    },

    startPassiveIncome: () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(() => {
        set((state) => {
          const boosterMultiplier = state.activeBoosters.reduce(
            (acc, booster) => acc * booster.effectMultiplier,
            1
          );
          const incomePerSecond =
            (state.passiveIncomeRate / 3600) * boosterMultiplier;
          const newCoins = state.coins + incomePerSecond;
          localStorage.setItem("coins", newCoins.toString());
          return { coins: newCoins };
        });
      }, 1000); // Обновление каждую секунду
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
        get().restoreEnergy();
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
      const {
        lastActiveTime,
        passiveIncomeRate,
        incrementCoins,
        setOfflineIncome,
      } = get();
      if (lastActiveTime !== null) {
        const currentTime = Date.now();
        const timeDifference = (currentTime - lastActiveTime) / 1000; // в секундах

        const maxTime = 3 * 60 * 60; // 3 часа в секундах
        const effectiveTime = Math.min(timeDifference, maxTime);

        const offlineIncome = (passiveIncomeRate / 3600) * effectiveTime;

        incrementCoins(offlineIncome);
        setOfflineIncome(offlineIncome);
      }
    },

    calculateEnergyRestoration: () => {
      const {
        lastActiveTime,
        maxEnergy,
        energy,
        restoreMaxEnergy,
        setLastActiveTime,
      } = get();
      if (lastActiveTime !== null) {
        const currentTime = Date.now();
        const timeDifference = (currentTime - lastActiveTime) / 1000; // в секундах
        const restoredEnergy = Math.floor(timeDifference * 2); // 2 энергии в секунду
        const newEnergy = Math.min(energy + restoredEnergy, maxEnergy); // Не превышаем maxEnergy

        set({ energy: newEnergy });
        setLastActiveTime(currentTime); // Обновляем время последнего активного входа
      }
    },
  };
});

export default useCoinStore;
