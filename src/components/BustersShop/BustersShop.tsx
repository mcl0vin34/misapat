import React from "react";
import useCoinStore from "../../store/useCoinStore";
import styles from "./BustersShop.module.scss";

const BustersShop = () => {
  const { upgrades, purchaseUpgrade, coins, passiveIncomeRate } =
    useCoinStore();

  return (
    <div className={styles.bustersShop}>
      <h1>Прокачка пассивного дохода</h1>
      <p>Текущий пассивный доход: {Math.round(passiveIncomeRate)} монет/час</p>
      <p>Ваши монеты: {Math.floor(coins)}</p>
      <div className={styles.upgrades}>
        {upgrades.map((upgrade) => (
          <div key={upgrade.id} className={styles.upgradeItem}>
            <h2>{upgrade.name}</h2>
            <p>
              Уровень: {upgrade.level} / {upgrade.maxLevel}
            </p>
            <p>Стоимость: {upgrade.cost} монет</p>
            <p>Увеличение дохода: +{upgrade.rateIncreasePerLevel} монет/час</p>
            <p>
              Общий вклад: +{Math.round(upgrade.totalRateIncrease)} монет/час
            </p>
            <button
              onClick={() => purchaseUpgrade(upgrade.id)}
              disabled={
                coins < upgrade.cost || upgrade.level >= upgrade.maxLevel
              }
            >
              {upgrade.level >= upgrade.maxLevel
                ? "Максимальный уровень"
                : "Улучшить"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BustersShop;
