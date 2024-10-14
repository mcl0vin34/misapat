// src/components/EnergyIndicator/EnergyIndicator.tsx
import React from "react";
import useCoinStore from "../../store/useCoinStore";
import { ReactComponent as EnergyIcon } from "../../assets/icons/energy.svg"; // Импортируем SVG как React-компонент
import "./EnergyIndicator.scss";

const EnergyIndicator: React.FC = () => {
  const { energy, maxEnergy } = useCoinStore();

  return (
    <div className="energy-indicator">
      <EnergyIcon className="energy-icon" aria-label="Энергия" />{" "}
      {/* Заменили img на SVG */}
      <p className="energy-text">
        {energy} / {maxEnergy}
      </p>
    </div>
  );
};

export default EnergyIndicator;
