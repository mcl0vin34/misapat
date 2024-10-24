// src/components/BoostersShop/BoostersShop.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import useCoinStore from "../../store/useCoinStore"; // Импортируем useCoinStore
import styles from "./BoostersShop.module.scss";
import BoosterModalContent from "./BoosterModalContent/BoosterModalContent";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import useModalStore from "../../store/useModalStore";
import { Upgrade } from "../../types/Upgrade";
import CoinEffect from "../UI/CoinEffect/CoinEffect";
import vibrate from "../../utils/vibrate";

const BoostersShop = () => {
  const { openModal, closeModal } = useModalStore();

  const { coins, upgrades, purchaseUpgrade, isPurchasing, setUpgrades } =
    useCoinStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCoinEffect, setShowCoinEffect] = useState(false);

  // Функция для получения списка бустеров с бэкенда
  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const response = await axios.get<Upgrade[]>(
          `${process.env.REACT_APP_API_URL}api/upgrades?userId=${
            useCoinStore.getState().userId
          }`
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
  }, [setUpgrades]);

  const handleUpgradeClick = (upgrade: Upgrade) => {
    console.log("Opening modal for upgrade:", upgrade);
    // Проверяем, хватает ли монет для покупки
    const isAffordable = coins >= (upgrade.next_level_cost || 0);
    const isMaxed = upgrade.next_level === null;

    openModal(
      <BoosterModalContent
        upgrade={upgrade}
        onPurchase={async () => {
          try {
            await purchaseUpgrade(upgrade.upgrade_id);
            setShowCoinEffect(true);
            vibrate(100);
            closeModal();
          } catch (error) {
            console.error("Ошибка при покупке апгрейда:", error);
            // Отображение уведомления об ошибке
          }
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
    <div className={styles.boostersShop}>
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

export default BoostersShop;
