// src/types/Booster.ts

import goldLionImage from "../assets/images/gold-lion.webp";
import kingBonusImage from "../assets/images/kingbonus.webp"; // Убедитесь, что путь корректный

export interface Booster {
  upgrade_id: number;
  name: string;
  description: string;
  income_increase_per_level: number;
  max_level: number;
  imageUrl: string;
  upgrade_costs: number[];
}

export const boosters: Booster[] = [
  {
    upgrade_id: 1,
    name: "Золотой лев",
    description: "Увеличивает пассивный доход на 1 000 монет/час за уровень.",
    income_increase_per_level: 1000,
    max_level: 10,
    imageUrl: goldLionImage,
    upgrade_costs: [
      5000, 7500, 11250, 16875, 25310, 37970, 56960, 85430, 128150, 192220,
    ],
  },
  {
    upgrade_id: 2,
    name: "Королевский бонус",
    description: "Увеличивает пассивный доход на 2 000 монет/час за уровень.",
    income_increase_per_level: 2000,
    max_level: 10,
    imageUrl: kingBonusImage,
    upgrade_costs: [
      7500, 12000, 19200, 30720, 49150, 78640, 125830, 201330, 322120, 515400,
    ],
  },
];
