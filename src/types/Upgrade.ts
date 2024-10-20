// src/types/Upgrade.ts

export interface Upgrade {
  id: number; // ID бустера
  name: string; // Название бустера
  imageUrl: string; // URL изображения
  level: number; // Текущий уровень бустера
  maxLevel: number; // Максимальный уровень бустера
  cost: number; // Текущая стоимость
  rateIncreasePerLevel: number; // Увеличение дохода на уровень
  totalRateIncrease: number; // Полный прирост дохода
}
