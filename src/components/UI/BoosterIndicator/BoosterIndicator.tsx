// src/components/UI/BoosterIndicator/BoosterIndicator.tsx

import React, { useState } from "react";
import useCoinStore from "../../../store/useCoinStore";
import useModalStore from "../../../store/useModalStore";
import { ReactComponent as BoosterIcon } from "../../../assets/icons/booster.svg";
import "./BoosterIndicator.scss";
import BoosterModalContent from "./BoosterModalContent/index"; // Обновите путь при необходимости

const BoosterIndicator: React.FC = () => {
  const availableBoosters = useCoinStore((state) => state.availableBoosters);
  const totalBoosters = useCoinStore((state) => state.totalBoosters);
  const activateBoost = useCoinStore((state) => state.activateBoost);
  const { openModal, closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleBoosterClick = () => {
    openModal(
      <BoosterModalContent
        availableBoosters={availableBoosters}
        totalBoosters={totalBoosters}
        onConfirm={async () => {
          setIsLoading(true);
          await activateBoost();
          setIsLoading(false);
          closeModal();
        }}
        isLoading={isLoading}
        closeModal={closeModal}
      />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)"
    );
  };

  return (
    <div className="booster-indicator" onClick={handleBoosterClick}>
      <p className="booster_count">
        {availableBoosters} / {totalBoosters}
      </p>
      <BoosterIcon
        className="booster-icon"
        role="button"
        aria-label="Использовать бустер"
      />
    </div>
  );
};

export default BoosterIndicator;
