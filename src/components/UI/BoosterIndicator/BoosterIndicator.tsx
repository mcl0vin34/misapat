// src/components/BoosterIndicator/BoosterIndicator.tsx

import React, { useState } from "react";
import useCoinStore from "../../../store/useCoinStore";
import useModalStore from "../../../store/useModalStore";
import { ReactComponent as BoosterIcon } from "../../../assets/icons/booster.svg";
import rocketIcon from "../..//../assets/images/rocket.png"; // Оставляем как PNG
import { ReactComponent as CoinIcon } from "../..//../assets/icons/coin.svg";
import "./BoosterIndicator.scss";

const BoosterIndicator: React.FC = () => {
  const { availableBoosters, totalBoosters, activateBooster } = useCoinStore();
  const { openModal, closeModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(false); // Добавили состояние загрузки

  const handleBoosterClick = () => {
    if (availableBoosters > 0) {
      openModal(
        <>
          <div className="booster_confirm_wrapper">
            <img src={rocketIcon} alt="Rocket" className="rocket-icon" />
            <h2 className="booster_confirm-title">Использовать бустер?</h2>
            <p className="booster_confirm-description">
              У вас есть возможность бесплатно восполнить ваш запас энергии.
            </p>
            <div className="modal-actions">
              <div className="free">
                <CoinIcon className="coin-image" />
                <span className="free-description">Бесплатно</span>
              </div>
              <button
                className="confirm-button"
                onClick={async () => {
                  setIsLoading(true); // Устанавливаем состояние загрузки
                  await activateBooster();
                  setIsLoading(false); // Снимаем состояние загрузки
                  closeModal();
                }}
                disabled={isLoading} // Отключаем кнопку во время загрузки
              >
                {isLoading ? "Загрузка..." : "Воспользоваться"}
              </button>
            </div>
          </div>
        </>
      );
    } else {
      alert("У вас нет доступных бустеров!");
    }
  };

  return (
    <div className="booster-indicator">
      <p className="booster_count">
        {availableBoosters} / {totalBoosters}
      </p>
      <BoosterIcon
        className="booster-icon"
        onClick={handleBoosterClick}
        role="button"
        aria-label="Использовать бустер"
      />
    </div>
  );
};

export default BoosterIndicator;
