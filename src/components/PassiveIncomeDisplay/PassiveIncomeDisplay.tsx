// src/components/PassiveIncomeDisplay/PassiveIncomeDisplay.tsx

import React from "react";
import "./PassiveIncomeDisplay.scss";

interface PassiveIncomeDisplayProps {
  incomeRate: number; // В монетах в час
}

const PassiveIncomeDisplay: React.FC<PassiveIncomeDisplayProps> = ({
  incomeRate,
}) => {
  const hourlyRate = incomeRate; // Значение уже в монетах в час

  // Функция для форматирования значения
  const formatIncome = (value: number): string => {
    if (value < 1000) {
      return `+ ${Math.round(value)} в час`;
    } else if (value >= 1000 && value < 10000) {
      const formatted = Math.round((value / 1000) * 100) / 100; // Округляем до 2 знаков после запятой
      return `+ ${formatted}k в час`;
    } else if (value >= 10000 && value < 100000) {
      const formatted = Math.round((value / 1000) * 10) / 10; // Округляем до 1 знака после запятой
      return `+ ${formatted}k в час`;
    } else {
      const formatted = Math.round(value / 1000); // Округляем до целого числа
      return `+ ${formatted}k в час`;
    }
  };

  return <p className="passive-income-text">{formatIncome(hourlyRate)}</p>;
};

export default PassiveIncomeDisplay;
