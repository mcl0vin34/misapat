// src/components/DailyRewardModal/DailyRewardModal.tsx

import React, { useState } from "react";
import styles from "./DailyRewardModal.module.scss";
import useModalStore from "../../../store/useModalStore";
import RewardCollectModal from "./RewardCollectionModal/RewardCollectionModal";
import { ReactComponent as RewardCardIcon } from "../../../assets/icons/reward-card.svg";
import dailyCardsImg from "../../../assets/icons/daily-cards.png"; // Импортируем изображение

interface DailyRewardCardProps {
  day: number;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick: (day: number) => void;
}

const DailyRewardCard: React.FC<DailyRewardCardProps> = ({
  day,
  isCurrent,
  isCompleted,
  onClick,
}) => {
  const handleClick = () => {
    if (isCurrent && !isCompleted) {
      onClick(day);
    }
  };

  return (
    <div
      className={`${styles.card} ${isCurrent ? styles.currentDay : ""} ${
        isCompleted ? styles.completed : ""
      }`}
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

  const handleCardClick = (day: number) => {
    openModal(
      <RewardCollectModal
        day={day}
        onComplete={() => {
          setCompletedDays([...completedDays, day]);
          closeModal(); // Закрыть RewardCollectModal
        }}
      />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)"
    );
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={handleClose}></button>
      {/* Добавляем изображение сверху */}
      <div className={styles.header}>
        <img
          src={dailyCardsImg}
          alt="Daily Cards"
          className={styles.headerImage}
        />

        {/* Заголовок "Карта дня" */}
        <h3 className={styles.subtitle}>Карта дня</h3>

        {/* Описание */}

        <p className={styles.description}>
          Заходи каждый день, получай вознаграждение и совет на день!
        </p>
      </div>
      {/* Список карточек */}
      <div className={styles.cardsContainer}>
        {Array.from({ length: 13 }).map((_, index) => {
          const day = index + 1;
          const isCurrent = day === 1; // Пока что первый день
          const isCompleted = completedDays.includes(day);

          return (
            <DailyRewardCard
              key={day}
              day={day}
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
