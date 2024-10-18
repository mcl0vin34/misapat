// src/types/Upgrade.ts

export interface Upgrade {
  id: number;
  name: string;
  imageUrl: string;
  level: number;
  maxLevel: number;
  cost: number;
  rateIncreasePerLevel: number;
  totalRateIncrease: number;
}
