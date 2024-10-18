// src/components/BustersShop/BustersShop.tsx

import React, { useState } from "react";
import goldLionImage from "../../assets/images/gold-lion.webp";
import thirteenImage from "../../assets/images/kingbonus.webp";
import styles from "./BustersShop.module.scss";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import useModalStore from "../../store/useModalStore"; // Импорт хука для модальных окон
import BusterModalContent from "./BusterModalContent/BusterModalContent"; // Импорт нового компонента модального окна
import { Upgrade } from "../../types/Upgrade"; // Импорт типа Upgrade

const BustersShop = () => {
  const [coins, setCoins] = useState<number>(10000); // начальные монеты
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 1,
      name: "Золотой лев",
      imageUrl: goldLionImage, // замени на реальный путь к изображению
      level: 1,
      maxLevel: 10,
      cost: 2500,
      rateIncreasePerLevel: 300,
      totalRateIncrease: 300,
    },
    {
      id: 2,
      name: "Королевский бонус",
      imageUrl: thirteenImage, // замени на реальный путь к изображению
      level: 1,
      maxLevel: 10,
      cost: 1500,
      rateIncreasePerLevel: 700,
      totalRateIncrease: 700,
    },
  ]);

  const { openModal } = useModalStore(); // Деструктурируем openModal из хука

  const purchaseUpgrade = (id: number) => {
    setUpgrades((prevUpgrades) =>
      prevUpgrades.map((upgrade) => {
        if (
          upgrade.id === id &&
          upgrade.level < upgrade.maxLevel &&
          coins >= upgrade.cost
        ) {
          const newLevel = upgrade.level + 1;
          const newCost = Math.floor(upgrade.cost * 1.8); // Увеличение стоимости
          const newTotalRateIncrease =
            upgrade.totalRateIncrease + upgrade.rateIncreasePerLevel;

          setCoins(coins - upgrade.cost); // Вычитаем монеты

          return {
            ...upgrade,
            level: newLevel,
            cost: newCost,
            totalRateIncrease: newTotalRateIncrease,
          };
        }
        return upgrade;
      })
    );
  };

  const handleUpgradeClick = (upgrade: Upgrade) => {
    openModal(
      <BusterModalContent upgrade={upgrade} />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)" // Передаём градиент
    );
  };

  return (
    <div className={styles.bustersShop}>
      {/*<p>Ваши монеты: {coins}</p>*/}
      <div className={styles.upgrades}>
        {upgrades.map((upgrade) => (
          <div
            key={upgrade.id}
            className={styles.upgradeItem}
            onClick={() => handleUpgradeClick(upgrade)} // Добавляем обработчик клика
          >
            <div className={styles.upgradeImage_wrapper}>
              <img
                className={styles.upgradeImage}
                src={upgrade.imageUrl}
                alt={upgrade.name}
              />
              <div className={styles.gradientOverlay}></div> {/* Градиент */}
            </div>
            <div className={styles.upgradeContent}>
              <div className={styles.topRow}>
                <div className={styles.upgradeName}>{upgrade.name}</div>
                <div className={styles.upgradeLevel}>
                  Уровень {upgrade.level}
                </div>
              </div>
              <div className={styles.bottomRow}>
                <div className={styles.income}>
                  <p className={styles.income__top}>Доход в час:</p>

                  <div className={styles.income__value}>
                    <CoinIcon className={styles.income__icon} />
                    <span className={styles.income__value_text}>
                      +{upgrade.rateIncreasePerLevel}
                    </span>
                  </div>
                </div>

                <div className={styles.currentCostWrapper}>
                  <CoinIcon className={styles.another__icon} />

                  <span className={styles.currentCost__value}>
                    {upgrade.cost}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BustersShop;
