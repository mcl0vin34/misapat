// src/components/EnergyIndicator/EnergyIndicator.tsx
import React from "react";
import useCoinStore from "../../../store/useCoinStore";
import { ReactComponent as EnergyIcon } from "../../../assets/icons/energy.svg";
import "./EnergyIndicator.scss";

const EnergyIndicator: React.FC = () => {
  const { energy, maxEnergy } = useCoinStore();

  return (
    <div className="energy-indicator">
      <EnergyIcon className="energy-icon" aria-label="Энергия" />{" "}
      <p className="energy-text">
        {energy} / {maxEnergy}
      </p>
    </div>
  );
};

export default EnergyIndicator;
