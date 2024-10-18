// src/pages/QuestsPage/QuestsPage.tsx

import React, { useState } from "react";
import SharedContainer from "../../components/UI/SharedContainer/SharedContainer";
import magImg from "../../assets/images/mag.jpg";
import styles from "./QuestsPage.module.scss";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import { ReactComponent as RightArrow } from "../../assets/icons/right-arrow.svg";
import { ReactComponent as DoneIcon } from "../../assets/icons/done-icon.svg";
import SimaLogo from "../../assets/images/sima-logo.png"; // Импорт общей иконки для квестов
import useModalStore from "../../store/useModalStore"; // Импорт хука для модальных окон
import QuestModalContent from "../../components/QuestModalContent/QuestModalContent"; // Импорт компонента модального окна
import { Quest } from "../../types/Quest"; // Импорт интерфейса Quest

const initialQuests: Quest[] = [
  {
    id: 1,
    title: "Скачать приложение sima-land.ru",
    reward: "+100 000",
    completed: false,
    icon: SimaLogo, // Общая иконка
  },
  {
    id: 2,
    title: "Подписаться на телеграм-канал «sima-land»",
    reward: "+50 000",
    completed: true,
    icon: SimaLogo, // Общая иконка
  },
  {
    id: 3,
    title: "Пригласить 1 друга",
    reward: "+10 000",
    completed: false,
    icon: SimaLogo, // Общая иконка
  },
];

const QuestsPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const { openModal } = useModalStore(); // Деструктурируем openModal из хука

  const handleCompleteQuest = (id: number): void => {
    const updatedQuests = quests.map((quest) =>
      quest.id === id ? { ...quest, completed: true } : quest
    );
    setQuests(updatedQuests);
  };

  const handleQuestClick = (quest: Quest) => {
    if (quest.completed) {
      // Если квест уже выполнен, ничего не делаем
      return;
    }

    openModal(
      <QuestModalContent
        quest={quest}
        onComplete={() => handleCompleteQuest(quest.id)}
      />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)" // Передаем градиент для фона модалки
    );
  };

  return (
    <SharedContainer>
      <div className={styles.questsPage}>
        <h1 className={styles.title}>Задания</h1>
        <p className={styles.subtitle}>Выполняй задания и получай награду!</p>

        {/* Статичный блок с ежедневной наградой */}
        <div className={styles.dailyReward}>
          <div className={styles.dailyReward_top}>
            <img
              src={magImg}
              alt="Ежедневная награда"
              className={styles.rewardImage}
            />

            <div className={styles.rewardDetails}>
              <h2 className={styles.rewardTitle}>Ежедневная награда</h2>

              <div className={styles.rewardAmountWrapper}>
                <CoinIcon className={styles.coinIcon} />
                <p className={styles.rewardAmount}>+20 000</p>
              </div>
            </div>

            <RightArrow />
          </div>

          {/* Прогресс-бар */}
          <div className={styles.progressBar}>
            {Array.from({ length: 13 }).map((_, index) => (
              <div
                key={index}
                className={`${styles.progressItem} ${
                  index < 3 ? styles.filled : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Список квестов */}
        <div className={styles.questsList}>
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`${styles.questCard} ${
                quest.completed ? styles.questCompleted : styles.questIncomplete
              }`}
              onClick={() => handleQuestClick(quest)}
              style={{ cursor: quest.completed ? "default" : "pointer" }}
            >
              <div className={styles.questCard_top}>
                {/*{quest.icon && (
                  <img
                    src={quest.icon}
                    alt={`${quest.title} icon`}
                    className={styles.questIcon}
                  />
                )}*/}

                <div className={styles.questDetails}>
                  <div>
                    <h3 className={styles.questTitle}>{quest.title}</h3>
                    <div className={styles.rewardAmountWrapper}>
                      <CoinIcon className={styles.coinIcon} />
                      <p className={styles.rewardAmount}>{quest.reward}</p>
                    </div>
                  </div>

                  {quest.completed ? (
                    <DoneIcon className={styles.doneIcon} />
                  ) : (
                    <RightArrow className={styles.arrowRight} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SharedContainer>
  );
};

export default QuestsPage;
