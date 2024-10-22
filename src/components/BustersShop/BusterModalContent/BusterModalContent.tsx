// src/components/BustersShop/BusterModalContent/BusterModalContent.tsx

import React, { useState } from "react";
import styles from "./BusterModalContent.module.scss";
import { Upgrade } from "../../../types/Upgrade";
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";
import useCoinStore from "../../../store/useCoinStore"; // Импортируем хук Zustand

interface BusterModalContentProps {
  upgrade: Upgrade;
  onPurchase: () => void; // Функция для закрытия модалки
}

const BusterModalContent: React.FC<BusterModalContentProps> = ({
  upgrade,
  onPurchase,
}) => {
  const { purchaseUpgrade } = useCoinStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await purchaseUpgrade(upgrade.id);
      onPurchase(); // Закрываем модалку при успехе
    } catch (err: any) {
      setError(err); // Устанавливаем сообщение об ошибке
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.busterModalContent}>
      <div className={styles.booster_price_wrapper}>
        <CoinIcon className={styles.coinIcon} />
        <p className={styles.booster_price_title}>{upgrade.cost}</p>
      </div>
      <img src={upgrade.imageUrl} alt={upgrade.name} className={styles.image} />
      <h2 className={styles.title}>{upgrade.name}</h2>
      <p className={styles.level}>
        Уровень: {upgrade.level} / {upgrade.maxLevel}
      </p>
      <p className={styles.income_info}>
        Ваш пассивный доход <br /> в час увеличится на:
      </p>
      <div className={styles.passive_income_wrapper}>
        <CoinIcon className={styles.coinIcon} />
        <p className={styles.passive_income_value}>
          +{upgrade.rateIncreasePerLevel} монет/час
        </p>
      </div>
      {error && <p className={styles.error}>{error}</p>}{" "}
      {/* Отображение ошибки внутри модалки */}
      <button
        className={styles.buy_btn}
        onClick={handlePurchase}
        disabled={isProcessing}
      >
        {isProcessing ? "Покупка..." : "Купить бустер"}
      </button>
    </div>
  );
};

export default BusterModalContent;
