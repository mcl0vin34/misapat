// src/store/useStore.ts
import { create } from "zustand";
import useCoinStore from "./useCoinStore";

interface Upgrade {
  id: number;
  name: string;
  baseCost: number;
  cost: number;
  rateIncrease: number;
  level: number;
}

interface StoreState {
  upgrades: Upgrade[];
  purchaseUpgrade: (id: number) => void;
}

const useStore = create<StoreState>((set, get) => {
  const { setPassiveIncomeRate } = useCoinStore.getState();

  // Загрузка улучшений из localStorage
  const savedUpgrades = localStorage.getItem("upgrades");
  const initialUpgrades: Upgrade[] = savedUpgrades
    ? JSON.parse(savedUpgrades)
    : [
        {
          id: 1,
          name: "Улучшение 1",
          baseCost: 10,
          cost: 10,
          rateIncrease: 1,
          level: 0,
        },
        {
          id: 2,
          name: "Улучшение 2",
          baseCost: 50,
          cost: 50,
          rateIncrease: 5,
          level: 0,
        },
        {
          id: 3,
          name: "Улучшение 3",
          baseCost: 100,
          cost: 100,
          rateIncrease: 10,
          level: 0,
        },
        {
          id: 4,
          name: "Улучшение 4",
          baseCost: 200,
          cost: 200,
          rateIncrease: 20,
          level: 0,
        },
        {
          id: 5,
          name: "Улучшение 5",
          baseCost: 500,
          cost: 500,
          rateIncrease: 50,
          level: 0,
        },
      ];

  // Функция для пересчета пассивного дохода на основе уровня улучшений
  const calculatePassiveIncome = (upgrades: Upgrade[]): number => {
    return upgrades.reduce(
      (total, upgrade) => total + upgrade.rateIncrease * upgrade.level,
      0
    );
  };

  // Устанавливаем начальный пассивный доход на основе улучшений
  setPassiveIncomeRate(calculatePassiveIncome(initialUpgrades));

  return {
    upgrades: initialUpgrades,

    purchaseUpgrade: (id: number) => {
      const { coins } = useCoinStore.getState();
      const upgrade = get().upgrades.find((u) => u.id === id);

      if (upgrade && coins >= upgrade.cost) {
        set((state) => {
          const newCoins = coins - upgrade.cost;
          useCoinStore.getState().incrementCoins(-upgrade.cost);

          const newUpgrades = state.upgrades.map((u) =>
            u.id === id
              ? {
                  ...u,
                  level: u.level + 1,
                  cost: Math.round(u.baseCost * Math.pow(1.15, u.level + 1)),
                }
              : u
          );

          const newPassiveIncome = calculatePassiveIncome(newUpgrades);
          setPassiveIncomeRate(newPassiveIncome);

          localStorage.setItem("upgrades", JSON.stringify(newUpgrades));

          return { upgrades: newUpgrades };
        });
      }
    },
  };
});

export default useStore;
