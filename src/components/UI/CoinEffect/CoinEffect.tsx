// src/components/UI/CoinEffect/CoinEffect.tsx
import React from "react";
import styles from "./CoinEffect.module.scss";
import coinImage from "../../../assets/icons/coin.svg";

interface CoinEffectProps {
  onComplete: () => void;
}

const CoinEffect: React.FC<CoinEffectProps> = ({ onComplete }) => {
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
          } as React.CSSProperties
        }
        onAnimationEnd={index === 0 ? onComplete : undefined} // Вызываем onComplete один раз
      />
    );
  });

  return <div className={styles.coinEffect}>{coins}</div>;
};

export default CoinEffect;
