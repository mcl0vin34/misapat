// src/types/Upgrade.ts

export interface Upgrade {
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
