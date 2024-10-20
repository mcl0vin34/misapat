// src/components/RewardCollectModal/RewardCollectModal.tsx

import React, { useState } from "react";
import styles from "./RewardCollectionModal.module.scss";
import useCoinStore from "../../../../store/useCoinStore";
import { toast } from "react-toastify";

interface RewardCollectModalProps {
  day: number;
  onComplete: () => void;
}

const RewardCollectModal: React.FC<RewardCollectModalProps> = ({
  day,
  onComplete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { incrementCoins } = useCoinStore();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCollect = () => {
    // Логика сбора награды
    const rewardAmount = 20000; // Пример награды
    incrementCoins(rewardAmount);
    toast.success(`Вы получили ${rewardAmount} монет!`);
    onComplete();
  };

  return (
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onComplete}></button>
      <div
        className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ""}`}
        onClick={handleFlip}
      >
        <div className={styles.card}>
          <div className={styles.front}>
            <h3>Награда за День {day}</h3>
            <p>Кликните, чтобы перевернуть карточку и получить награду!</p>
          </div>
          <div className={styles.back}>
            <h3>Поздравляем!</h3>
            <p>Вы получили +20 000 монет!</p>
            <button className={styles.collectButton} onClick={handleCollect}>
              Забрать награду
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCollectModal;
