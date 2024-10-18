// src/components/QuestModalContent/QuestModalContent.tsx

import React, { useState, useEffect } from "react";
import styles from "./QuestModalContent.module.scss";
import { Quest } from "../../types/Quest";
import useModalStore from "../../store/useModalStore"; // Импорт хука для модальных окон
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import { ReactComponent as PartyIcon } from "../../assets/icons/party-icon.svg";

interface QuestModalContentProps {
  quest: Quest;
  onComplete: () => void;
}

const QuestModalContent: React.FC<QuestModalContentProps> = ({
  quest,
  onComplete,
}) => {
  const { closeModal } = useModalStore(); // Получаем функцию закрытия модалки
  const [status, setStatus] = useState<"initial" | "checking" | "success">(
    "initial"
  ); // Состояние модалки
  const [remainingTime, setRemainingTime] = useState<number>(0); // Остаток времени в секундах

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "checking") {
      // Устанавливаем общий таймер на 1 час (3600 секунд)
      // Для тестирования можно использовать меньшее время, например, 60 секунд
      const totalTime = 3; // 3600 секунд = 1 час
      setRemainingTime(totalTime);

      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setStatus("success");
            onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Обновление каждую секунду
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, onComplete]);

  const handleCheck = () => {
    setStatus("checking"); // Переходим в состояние проверки
    // Здесь можно добавить реальную логику проверки выполнения задания
  };

  // Форматирование времени в формат ЧЧ:ММ:СС
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Функция для отображения иконки в зависимости от состояния
  const renderIcon = () => {
    if (status === "success") {
      return <PartyIcon className={styles.modalIcon} />;
    }
    return (
      <img
        src={quest.icon}
        alt={`${quest.title} icon`}
        className={styles.modalIcon}
      />
    );
  };

  // Функция для отображения контента в зависимости от состояния
  const renderContent = () => {
    if (status === "success") {
      return (
        <>
          <div className={styles.successMessage}>
            <p>Поздравляем, награда уже перечислена тебе на баланс!</p>
          </div>
          <div className={styles.reward_wrapper}>
            <CoinIcon />
            <p className={styles.reward_amount}>{quest.reward}</p>
          </div>
        </>
      );
    }

    return (
      <>
        <h2>{quest.title}</h2>
        <div className={styles.reward_wrapper}>
          <CoinIcon />
          <p className={styles.reward_amount}>{quest.reward}</p>
        </div>
        {status === "initial" ? (
          <button className={styles.checkButton} onClick={handleCheck}>
            Проверить
          </button>
        ) : (
          <button className={styles.checkButton} disabled>
            Осталось времени: {formatTime(remainingTime)}
          </button>
        )}
        {/*{status === "checking" && (
          <p className={styles.checkingText}>Задание проверяется...</p>
        )}*/}
      </>
    );
  };

  return (
    <div className={`${styles.questModalContent} ${styles.doneModalContent}`}>
      {renderIcon()} {/* Отображаем иконку в зависимости от состояния */}
      {renderContent()} {/* Отображаем контент в зависимости от состояния */}
    </div>
  );
};

export default QuestModalContent;
