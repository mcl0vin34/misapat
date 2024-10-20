// src/components/BusterModalContent/BusterModalContent.tsx

import React from "react";
import styles from "./BusterModalContent.module.scss";
import { Upgrade } from "../../../types/Upgrade"; // Корректный путь к типу
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";

interface BusterModalContentProps {
  upgrade: Upgrade;
  onPurchase: () => void; // Добавляем это поле
}

const BusterModalContent: React.FC<BusterModalContentProps> = ({
  upgrade,
  onPurchase,
}) => {
  return (
    <div className={styles.busterModalContent}>
      <div className={styles.booster_price_wrapper}>
        <CoinIcon className={styles.coinIcon} />
        <p className={styles.booster_price_title}> {upgrade.cost} </p>
      </div>
      <img src={upgrade.imageUrl} alt={upgrade.name} className={styles.image} />
      <h2 className={styles.title}>{upgrade.name}</h2>
      <p className={styles.level}>Уровень: {upgrade.level}</p>
      <p className={styles.income_info}>
        Ваш пассивный доход <br /> в час увеличится на:
      </p>
      <div className={styles.passive_income_wrapper}>
        <CoinIcon className={styles.coinIcon} />
        <p className={styles.passive_income_value}>
          +{upgrade.rateIncreasePerLevel}{" "}
        </p>
      </div>
      <button className={styles.buy_btn} onClick={onPurchase}>
        Купить бустер
      </button>{" "}
      {/* Добавляем обработчик клика */}
    </div>
  );
};

export default BusterModalContent;
