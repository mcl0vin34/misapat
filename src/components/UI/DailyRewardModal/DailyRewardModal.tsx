// src/components/DailyRewardModal/DailyRewardModal.tsx

import React, { useState } from "react";
import styles from "./DailyRewardModal.module.scss";
import useModalStore from "../../../store/useModalStore"; // Исправленный путь
import RewardCollectModal from "./RewardCollectionModal/RewardCollectionModal";
import { ReactComponent as RewardCardIcon } from "../../../assets/icons/reward-card.svg";
import dailyCardsImg from "../../../assets/icons/daily-cards.png";
import imgUrl from "../../../assets/cards/card-1.png";

// Определяем интерфейс для карточки
interface Card {
  id: number;
  description: string;
  imagePath: string;
}

interface DailyRewardCardProps {
  day: number;
  card: Card;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick: (card: Card) => void;
}

const DailyRewardCard: React.FC<DailyRewardCardProps> = ({
  day,
  card,
  isCurrent,
  isCompleted,
  onClick,
}) => {
  const handleClick = () => {
    if (isCurrent && !isCompleted) {
      onClick(card);
    }
  };

  return (
    <div
      className={`${styles.card} ${isCurrent ? styles.currentDay : ""}`}
      onClick={handleClick}
      style={{ cursor: isCurrent && !isCompleted ? "pointer" : "default" }}
    >
      <div className={styles.dayLabel}>День {day}</div>
      <RewardCardIcon className={styles.cardIcon} />
    </div>
  );
};

const DailyRewardModal: React.FC = () => {
  const { closeModal, openModal } = useModalStore();
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  // Встроенный массив карточек (13 карточек)
  const cardsData: Card[] = Array.from({ length: 13 }, (_, index) => ({
    id: index + 1,
    description: `«Сила в спокойствии»`,
    imagePath: imgUrl, // Убедитесь, что изображения существуют
  }));

  const handleCardClick = (card: Card) => {
    openModal(
      <RewardCollectModal
        card={card}
        onComplete={() => {
          setCompletedDays([...completedDays, card.id]);
          closeModal(); // Закрыть RewardCollectModal
        }}
      />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)"
    );
  };

  const handleClose = () => {
    closeModal();
  };

  // Определяем текущий доступный день на основе завершенных дней
  const currentDay = completedDays.length + 1;

  return (
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={handleClose}></button>
      <div className={styles.header}>
        <img
          src={dailyCardsImg}
          alt="Daily Cards"
          className={styles.headerImage}
        />
        <h3 className={styles.subtitle}>Карта дня</h3>
        <p className={styles.description}>
          Заходи каждый день, получай вознаграждение и совет на день!
        </p>
      </div>
      <div className={styles.cardsContainer}>
        {cardsData.map((card, index) => {
          const day = index + 1;
          const isCurrent = day === currentDay;
          const isCompleted = completedDays.includes(card.id);

          return (
            <DailyRewardCard
              key={card.id}
              day={day}
              card={card}
              isCurrent={isCurrent}
              isCompleted={isCompleted}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DailyRewardModal;
