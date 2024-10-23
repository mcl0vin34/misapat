// src/components/UI/CoinEffect/CoinEffect.tsx

import React, { useEffect } from "react";
import styles from "./CoinEffect.module.scss";
import coinImage from "../../../assets/icons/coin.svg"; // Убедитесь, что путь верный

interface CoinEffectProps {
  onComplete: () => void; // Функция, вызываемая после завершения анимации
}

const CoinEffect: React.FC<CoinEffectProps> = ({ onComplete }) => {
  useEffect(() => {
    // Устанавливаем таймер для удаления эффекта после завершения анимации
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Продолжительность анимации в мс

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Генерируем массив монет с уникальными ключами
  const coins = Array.from({ length: 10 }).map((_, index) => {
    const xOffset = Math.random() * 200 - 100; // От -100 до +100 px
    const yOffset = Math.random() * 200 - 100; // От -100 до +100 px

    return (
      <img
        key={index}
        src={coinImage}
        alt="Coin"
        className={styles.coin}
        style={
          {
            "--move-x": `${xOffset}px`,
            "--move-y": `${yOffset}px`,
            left: `${Math.random() * 100}%`, // Распределяем монеты по экрану
            top: `${Math.random() * 100}%`,
          } as React.CSSProperties
        }
      />
    );
  });

  return <div className={styles.coinEffect}>{coins}</div>;
};

export default CoinEffect;
