// src/components/RewardCollectModal/RewardCollectionModal.tsx

import React, { useState } from "react";
import styles from "./RewardCollectionModal.module.scss";
import useCoinStore from "../../../../store/useCoinStore";
import { toast } from "react-toastify";
import { ReactComponent as RewardCardIcon } from "../../../../assets/icons/reward-card.svg";
import { ReactComponent as CoinIcon } from "../../../../assets/icons/coin.svg";
import imgUrl from "../../../../assets/cards/card-1.png";

interface Card {
  id: number;
  description: string;
  imagePath: string;
}

interface RewardCollectModalProps {
  card: Card;
  onComplete: () => void;
}

const RewardCollectModal: React.FC<RewardCollectModalProps> = ({
  card,
  onComplete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { incrementCoins } = useCoinStore();

  const rewardAmount = 20000;

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleCollect = () => {
    incrementCoins(rewardAmount);
    toast.success(`Вы получили ${rewardAmount.toLocaleString()} монет!`);
    onComplete();
  };

  return (
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onComplete}></button>
      <h3 className={styles.title}>День {card.id}</h3>
      {isFlipped && <h3 className={styles.description}>{card.description}</h3>}
      <div
        className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ""}`}
        onClick={!isFlipped ? handleFlip : undefined}
      >
        <div className={styles.card}>
          {!isFlipped ? (
            <div className={styles.front}>
              <RewardCardIcon className={styles.rewardIcon} />
            </div>
          ) : (
            <div className={styles.back}>
              <div className={styles.backInner}>
                <img
                  src={imgUrl}
                  alt={`Карточка День ${card.id}`}
                  className={styles.cardImage}
                />
                <div className={styles.rewardAmount}>
                  <CoinIcon />
                  <span>+{rewardAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardCollectModal;
