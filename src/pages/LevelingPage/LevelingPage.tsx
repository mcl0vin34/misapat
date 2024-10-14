// src/pages/LevelingPage/LevelingPage.tsx

import React from "react";
import useCoinStore from "../../store/useCoinStore";
import "./LevelingPage.scss";

const LevelingPage = () => {
  const { upgrades, purchaseUpgrade, coins, passiveIncomeRate } =
    useCoinStore();

  return (
    <div className="leveling-page">
      <h1>Прокачка пассивного дохода</h1>
      <p>
        Ваш текущий пассивный доход: {Math.round(passiveIncomeRate)} монет/час
      </p>
      <p>Ваши монеты: {Math.floor(coins)}</p>
      <div className="upgrades">
        {upgrades.map((upgrade) => (
          <div key={upgrade.id} className="upgrade-item">
            <h2>{upgrade.name}</h2>
            <p>
              Уровень: {upgrade.level} / {upgrade.maxLevel}
            </p>
            <p>Стоимость: {upgrade.cost} монет</p>
            <p>
              Увеличение дохода за уровень: +{upgrade.rateIncreasePerLevel}{" "}
              монет/час
            </p>
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

export default LevelingPage;
