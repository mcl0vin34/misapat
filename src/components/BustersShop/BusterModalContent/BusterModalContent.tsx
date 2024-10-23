// src/components/BusterModalContent/BusterModalContent.tsx

import React from "react";
import styles from "./BusterModalContent.module.scss";
import { Upgrade } from "../../../types/Upgrade"; // Корректный путь к типу
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";

interface BusterModalContentProps {
  upgrade: Upgrade;
  onPurchase: () => void;
  isPurchasing: boolean;
  isAffordable: boolean;
  isMaxed: boolean;
}

const BusterModalContent: React.FC<BusterModalContentProps> = ({
  upgrade,
  onPurchase,
  isPurchasing,
  isAffordable,
  isMaxed,
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

      {/*{isMaxed && (
        <div className={styles.maxLevelMessage}>
          <p>Этот бустер достиг максимального уровня!</p>
        </div>
      )}

      {!isAffordable && !isMaxed && (
        <div className={styles.insufficientFundsMessage}>
          <p>Недостаточно монет для покупки этого бустера.</p>
        </div>
      )}*/}

      <button
        className={`${styles.buy_btn} ${
          isMaxed || !isAffordable ? styles.disabled : ""
        }`}
        onClick={onPurchase}
        disabled={isPurchasing || isMaxed || !isAffordable} // Отключаем кнопку при загрузке, максимальном уровне или недостатке монет
      >
        {isPurchasing
          ? "Покупка..."
          : isMaxed
          ? "Максимальный уровень"
          : !isAffordable
          ? "Недостаточно монет"
          : "Купить бустер"}
      </button>
    </div>
  );
};

export default BusterModalContent;
