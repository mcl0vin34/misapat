// src/components/BustersShop/BustersShop.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserStore } from "../../store/useUserStore";
import styles from "./BustersShop.module.scss";
import { boosters } from "../../constants/boosters";
import BusterModalContent from "./BusterModalContent/BusterModalContent";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import useModalStore from "../../store/useModalStore";
import { Upgrade } from "../../types/Upgrade";
import CoinEffect from "../UI/CoinEffect/CoinEffect";
import vibrate from "../../utils/vibrate"; // Импортируем утилиту вибрации

const BustersShop = () => {
  const { user, setUser } = useUserStore();
  const { openModal, closeModal } = useModalStore();

  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    return boosters.map((booster) => ({
      id: booster.upgrade_id,
      name: booster.name,
      imageUrl: booster.imageUrl,
      level: 1,
      maxLevel: booster.max_level,
      cost: booster.upgrade_costs[0],
      rateIncreasePerLevel: booster.income_increase_per_level,
      totalRateIncrease: booster.income_increase_per_level,
    }));
  });

  const [isPurchasing, setIsPurchasing] = useState<number | null>(null);
  const [showCoinEffect, setShowCoinEffect] = useState(false);

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
          level: level,
          maxLevel: booster.max_level,
          cost: booster.upgrade_costs[level - 1],
          rateIncreasePerLevel: booster.income_increase_per_level,
          totalRateIncrease: booster.income_increase_per_level * level,
        };
      });
      setUpgrades(updatedUpgrades);
    }
  }, [user]);

  // Функция для отправки POST-запроса на покупку
  const purchaseUpgrade = async (upgradeId: number) => {
    try {
      setIsPurchasing(upgradeId);
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
        setUser({
          ...user,
          upgrades: updatedUpgrades,
          coins: response.data.coins, // Обновляем количество монет, если API возвращает их
        });
      }

      // Запускаем эффект рассыпающихся монеток
      setShowCoinEffect(true);

      // Запускаем вибрацию при успешной покупке
      vibrate(100); // Вибрация длительностью 100 мс
    } catch (error) {
      console.error("Ошибка при покупке апгрейда:", error);
      // Можно добавить здесь другие способы информирования пользователя об ошибке, если нужно
    } finally {
      setIsPurchasing(null);
    }
  };

  const handleUpgradeClick = (upgrade: Upgrade) => {
    // Проверяем, хватает ли монет для покупки
    const isAffordable = user ? user.coins >= upgrade.cost : false;
    const isMaxed = upgrade.level >= upgrade.maxLevel;

    openModal(
      <BusterModalContent
        upgrade={upgrade}
        onPurchase={async () => {
          await purchaseUpgrade(upgrade.id);
          closeModal();
        }}
        isPurchasing={isPurchasing === upgrade.id}
        isAffordable={isAffordable}
        isMaxed={isMaxed}
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
      {/* Рендерим CoinEffect, если нужно */}
      {showCoinEffect && (
        <CoinEffect onComplete={() => setShowCoinEffect(false)} />
      )}
    </div>
  );
};

export default BustersShop;
