// src/components/BustersShop/BustersShop.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserStore } from "../../store/useUserStore";
import styles from "./BustersShop.module.scss";
import { boosters, Booster } from "../../constants/boosters";
import BusterModalContent from "./BusterModalContent/BusterModalContent";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import useModalStore from "../../store/useModalStore";
import { Upgrade } from "../../types/Upgrade";

const BustersShop = () => {
  const { user, setUser } = useUserStore(); // Теперь setUser доступен
  const { openModal } = useModalStore();

  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    return boosters.map((booster) => ({
      id: booster.upgrade_id,
      name: booster.name,
      imageUrl: booster.imageUrl,
      level: 1, // Начальный уровень
      maxLevel: booster.max_level,
      cost: booster.upgrade_costs[0], // Начальная стоимость
      rateIncreasePerLevel: booster.income_increase_per_level,
      totalRateIncrease: booster.income_increase_per_level, // Начальное увеличение
    }));
  });

  useEffect(() => {
    if (user && user.upgrades) {
      const updatedUpgrades = boosters.map((booster) => {
        const userUpgrade = user.upgrades.find(
          (u) => u.upgrade_id === booster.upgrade_id
        );
        const level = userUpgrade?.level || 1;
        return {
          id: booster.upgrade_id,
          name: booster.name,
          imageUrl: booster.imageUrl,
          level: level, // Уровень из данных пользователя
          maxLevel: booster.max_level,
          cost: booster.upgrade_costs[level - 1], // Стоимость на текущем уровне
          rateIncreasePerLevel: booster.income_increase_per_level,
          totalRateIncrease: booster.income_increase_per_level * level, // Общий прирост дохода
        };
      });
      setUpgrades(updatedUpgrades);
    }
  }, [user]);

  // Функция для отправки POST-запроса на покупку
  // src/components/BustersShop/BustersShop.tsx

  const purchaseUpgrade = async (upgradeId: number) => {
    try {
      const response = await axios.post(
        `https://dev.simatap.ru/api/upgrades/purchase`,
        {},
        {
          params: {
            userId: user?.id,
            upgradeId: upgradeId,
          },
        }
      );

      const updatedUpgrades = response.data.upgrades;

      if (user) {
        // Обновляем состояние пользователя только если он определен
        setUser({
          ...user,
          upgrades: updatedUpgrades,
        });
      }
    } catch (error) {
      console.error("Ошибка при покупке апгрейда:", error);
    }
  };

  const handleUpgradeClick = (upgrade: Upgrade) => {
    openModal(
      <BusterModalContent
        upgrade={upgrade}
        onPurchase={() => purchaseUpgrade(upgrade.id)} // Передаем функцию покупки
      />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)"
    );
  };

  return (
    <div className={styles.bustersShop}>
      <div className={styles.upgrades}>
        {upgrades.map((upgrade) => (
          <div
            key={upgrade.id}
            className={styles.upgradeItem}
            onClick={() => handleUpgradeClick(upgrade)}
          >
            <div className={styles.upgradeImage_wrapper}>
              <img
                className={styles.upgradeImage}
                src={upgrade.imageUrl}
                alt={upgrade.name}
              />
              <div className={styles.gradientOverlay}></div>
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
