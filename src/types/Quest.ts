// src/types/Quest.ts

export interface Quest {
  id: number;
  title: string;
  reward: string;
  completed: boolean;
  icon?: string; // Путь к иконке (URL или импортированный модуль изображения)
}
