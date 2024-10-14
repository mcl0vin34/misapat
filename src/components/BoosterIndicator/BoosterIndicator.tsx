// src/components/BoosterIndicator/BoosterIndicator.tsx
import React from "react";
import useCoinStore from "../../store/useCoinStore";
import useModalStore from "../../store/useModalStore";
import { ReactComponent as BoosterIcon } from "../../assets/icons/booster.svg";
import rocketIcon from "../../assets/images/rocket.png"; // Оставляем как PNG
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import "./BoosterIndicator.scss";

const BoosterIndicator: React.FC = () => {
  const { availableBoosters, totalBoosters, activateBooster } = useCoinStore();
  const { openModal, closeModal } = useModalStore();

  const handleBoosterClick = () => {
    if (availableBoosters > 0) {
      openModal(
        <>
          <div className="booster_confirm_wrapper">
            <img src={rocketIcon} alt="Rocket" className="rocket-icon" />{" "}
            {/* Оставлено как img */}
            <h2 className="booster_confirm-title">Использовать бустер?</h2>
            <p className="booster_confirm-description">
              У вас есть возможность бесплатно восполнить ваш запас энергии.
            </p>
            <div className="modal-actions">
              <div className="free">
                <CoinIcon className="coin-image" /> {/* Заменили img на SVG */}
                <span className="free-description">Бесплатно</span>
              </div>
              <button
                className="confirm-button"
                onClick={() => {
                  activateBooster();
                  closeModal();
                }}
              >
                Воспользоваться
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
