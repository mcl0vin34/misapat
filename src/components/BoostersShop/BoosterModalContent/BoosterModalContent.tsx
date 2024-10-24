// src/components/BustersShop/BoosterModalContent/BoosterModalContent.tsx

import React from "react";
import styles from "./BoosterModalContent.module.scss";
import { Upgrade } from "../../../types/Upgrade";
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";

interface BoosterModalContentProps {
  upgrade: Upgrade;
  onPurchase: () => void;
  isPurchasing: boolean;
  isAffordable: boolean;
  isMaxed: boolean;
}

const BoosterModalContent: React.FC<BoosterModalContentProps> = ({
  upgrade,
  onPurchase,
  isPurchasing,
  isAffordable,
  isMaxed,
}) => {
  return (
    <div className={styles.boosterModalContent}>
      {upgrade.next_level_cost !== null && (
        <div className={styles.booster_price_wrapper}>
          <CoinIcon className={styles.coinIcon} />
          <p className={styles.booster_price_title}>
            {upgrade.next_level_cost}
          </p>
        </div>
      )}

      <h2 className={styles.title}>{upgrade.name}</h2>

      {upgrade.url && (
        <picture className={styles.image_wrapper}>
          <source
            srcSet={require(`../../../assets/images/${upgrade.url.replace(
              /\.(png|jpg|jpeg|gif)$/,
              ".webp"
            )}`)}
            type="image/webp"
          />
          <img
            src={require(`../../../assets/images/${upgrade.url}`)}
            alt={upgrade.name}
            className={styles.image}
          />
        </picture>
      )}

      <p className={styles.level}>Уровень: {upgrade.current_level}</p>
      <p className={styles.income_info}>
        Ваш пассивный доход <br /> в час увеличится на:
      </p>
      <div className={styles.passive_income_wrapper}>
        <CoinIcon className={styles.coinIcon} />
        <p className={styles.passive_income_value}>
          +{upgrade.income_increase_per_level}
        </p>
      </div>

      <button
        className={`${styles.buy_btn} ${
          isMaxed || !isAffordable ? styles.disabled : ""
        }`}
        onClick={onPurchase}
        disabled={isPurchasing || isMaxed || !isAffordable}
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

export default BoosterModalContent;
