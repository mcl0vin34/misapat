// src/components/UI/BoosterModalContent/BoosterModalContent.tsx

import React from "react";
import { ReactComponent as CoinIcon } from "../../../../assets/icons/coin.svg";
import rocketIcon from "../../../../assets/images/rocket.png";
import "./index.scss";

interface BoosterModalContentProps {
  availableBoosters: number;
  totalBoosters: number;
  onConfirm: () => void;
  isLoading: boolean;
  closeModal: () => void;
}

const BoosterModalContent: React.FC<BoosterModalContentProps> = ({
  availableBoosters,
  totalBoosters,
  onConfirm,
  isLoading,
  closeModal,
}) => {
  return (
    <div className="booster_confirm_wrapper">
      <img src={rocketIcon} alt="Rocket" className="rocket-icon" />
      {availableBoosters > 0 ? (
        <>
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
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Воспользоваться"}
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="booster_confirm-title">Нет доступных бустеров</h2>
          <p className="booster_confirm-description">
            У вас нет доступных бустеров. Пожалуйста, заработайте или
            приобретите бустер.
          </p>
          <div className="modal-actions">
            <button className="confirm-button disabled" disabled>
              Недоступно
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BoosterModalContent;
