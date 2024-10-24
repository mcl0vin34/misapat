// src/components/BustersShop/BustersShop.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserStore } from "../../store/useUserStore";
import styles from "./BustersShop.module.scss";
import BusterModalContent from "./BusterModalContent/BusterModalContent";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import useModalStore from "../../store/useModalStore";
import { Upgrade } from "../../types/Upgrade";
import CoinEffect from "../UI/CoinEffect/CoinEffect";
import vibrate from "../../utils/vibrate";

const BustersShop = () => {
  const { user, setUser } = useUserStore();
  const { openModal, closeModal } = useModalStore();

  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPurchasing, setIsPurchasing] = useState<number | null>(null);
  const [showCoinEffect, setShowCoinEffect] = useState(false);

  // Функция для получения списка бустеров с бэкенда
  useEffect(() => {
    const fetchUpgrades = async () => {
      if (!user?.id) {
        console.warn("User ID is not available.");
        setIsLoading(false);
        return;
      }

      console.log("Fetching upgrades for user ID:", user.id);

      try {
        const response = await axios.get<Upgrade[]>(
          `${process.env.REACT_APP_API_URL}api/upgrades?userId=${user.id}`
        );

        console.log("Received upgrades:", response.data);
        setUpgrades(response.data);
      } catch (error) {
        console.error("Ошибка при получении списка бустеров:", error);
        // Здесь можно добавить уведомление для пользователя об ошибке
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpgrades();
  }, [user]);

  // Функция для отправки POST-запроса на покупку
  const purchaseUpgrade = async (upgradeId: number) => {
    try {
      setIsPurchasing(upgradeId);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upgrades/purchase`,
        {},
        {
          params: {
            userId: user?.id,
            upgradeId: upgradeId,
          },
        }
      );

      console.log("Purchase response:", response.data);

      const updatedUpgrades = response.data.upgrades;

      if (user) {
        setUser({
          ...user,
          upgrades: updatedUpgrades,
          coins: response.data.coins, // Обновляем количество монет, если API возвращает их
        });
      }

      // Обновляем список апгрейдов в состоянии компонента
      setUpgrades(updatedUpgrades);

      // Запускаем эффект рассыпающихся монеток
      setShowCoinEffect(true);

      // Запускаем вибрацию при успешной покупке
      vibrate(100);
    } catch (error) {
      console.error("Ошибка при покупке апгрейда:", error);
      // Здесь можно добавить уведомление для пользователя об ошибке
    } finally {
      setIsPurchasing(null);
    }
  };

  const handleUpgradeClick = (upgrade: Upgrade) => {
    console.log("Opening modal for upgrade:", upgrade);
    // Проверяем, хватает ли монет для покупки
    const isAffordable = user
      ? user.coins >= (upgrade.next_level_cost || 0)
      : false;
    const isMaxed = upgrade.next_level === null;

    openModal(
      <BusterModalContent
        upgrade={upgrade}
        onPurchase={async () => {
          await purchaseUpgrade(upgrade.upgrade_id);
          closeModal();
        }}
        isPurchasing={isPurchasing === upgrade.upgrade_id}
        isAffordable={isAffordable}
        isMaxed={isMaxed}
      />,
      "linear-gradient(180deg, #2D3236 0%, #000000 100%)"
    );
  };

  if (isLoading) {
    return <div>Загрузка бустеров...</div>;
  }

  return (
    <div className={styles.bustersShop}>
      <div className={styles.upgrades}>
        {upgrades.length === 0 ? (
          <div>Бустеры не найдены.</div>
        ) : (
          upgrades.map((upgrade) => (
            <div
              key={upgrade.upgrade_id}
              className={styles.upgradeItem}
              onClick={() => handleUpgradeClick(upgrade)}
            >
              <div className={styles.upgradeImage_wrapper}>
                {upgrade.url && (
                  <picture>
                    <source
                      srcSet={require(`../../assets/images/${upgrade.url.replace(
                        /\.(png|jpg|jpeg|gif)$/,
                        ".webp"
                      )}`)}
                      type="image/webp"
                    />
                    <img
                      className={styles.upgradeImage}
                      src={require(`../../assets/images/${upgrade.url}`)}
                      alt={upgrade.name}
                    />
                  </picture>
                )}
                <div className={styles.gradientOverlay}></div>
              </div>
              <div className={styles.upgradeContent}>
                <div className={styles.topRow}>
                  <div className={styles.upgradeName}>{upgrade.name}</div>
                  <div className={styles.upgradeLevel}>
                    Уровень {upgrade.current_level}
                  </div>
                </div>
                <div className={styles.bottomRow}>
                  <div className={styles.income}>
                    <p className={styles.income__top}>Доход в час:</p>
                    <div className={styles.income__value}>
                      <CoinIcon className={styles.income__icon} />
                      <span className={styles.income__value_text}>
                        +{upgrade.cumulative_income}
                      </span>
                    </div>
                  </div>
                  {upgrade.next_level_cost !== null && (
                    <div className={styles.currentCostWrapper}>
                      <CoinIcon className={styles.another__icon} />
                      <span className={styles.currentCost__value}>
                        {upgrade.next_level_cost}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Рендерим CoinEffect, если нужно */}
      {showCoinEffect && (
        <CoinEffect onComplete={() => setShowCoinEffect(false)} />
      )}
    </div>
  );
};

export default BustersShop;
