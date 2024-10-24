// src/types/Upgrade.ts

export interface BoosterUpgrade {
  upgrade_id: number;
  name: string; // Добавляем свойство name
  description: string;
  url: string;
  current_level: number;
  next_level: number | null; // Если next_level может быть null
  next_level_cost: number | null; // Если cost может быть null
  income_increase_per_level: number;
  cumulative_income: number;
}
