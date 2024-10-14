// src/pages/MainPage/MainPage.tsx
import React, { useEffect, useState } from "react";
import lionImage from "../../assets/images/lion.png";
import coinIcon from "../../assets/icons/coin.svg";
import "./MainPage.scss"; // Верните импорт основного SCSS файла
import TapButton from "../../components/TapButton/TapButton";
import PassiveIncomeDisplay from "../../components/PassiveIncomeDisplay/PassiveIncomeDisplay";
import useCoinStore from "../../store/useCoinStore";
import EnergyIndicator from "../../components/EnergyIndicator/EnergyIndicator";
import BoosterIndicator from "../../components/BoosterIndicator/BoosterIndicator";
import AnimatedDigit from "../../components/UI/AnimatedDigit/AnimatedDigit";
import SharedContainer from "../../components/UI/SharedContainer/SharedContainer"; // Обновленный импорт

const MainPage = () => {
  const {
    decrementEnergy,
    coins,
    incrementCoins,
    passiveIncomeRate,
    offlineIncome,
    setOfflineIncome,
  } = useCoinStore();

  const [prevCoins, setPrevCoins] = useState(coins);

  const handleIncrement = () => {
    decrementEnergy();
    incrementCoins(1);
  };

  useEffect(() => {
    if (coins !== prevCoins) {
      setPrevCoins(coins);
    }
  }, [coins, prevCoins]);

  // Преобразуем число монет в строку и разделим на отдельные цифры
  const coinsString = Math.floor(coins).toString();
  const prevCoinsString = Math.floor(prevCoins).toString();

  // Дополняем предыдущие монеты ведущими нулями, если длина текущих монет больше
  const maxLength = Math.max(coinsString.length, prevCoinsString.length);
  const formattedCoins = coinsString.padStart(maxLength, "0");
  const formattedPrevCoins = prevCoinsString.padStart(maxLength, "0");

  // Разбиваем на массив цифр
  const coinsDigits = formattedCoins.split("");
  const prevCoinsDigits = formattedPrevCoins.split("");

  return (
    <SharedContainer>
      <div className="coin-display">
        <div className="coin-display_wrapper">
          <img src={coinIcon} alt="Coin" className="coin-icon" />
          <div className="coin-count">
            {coinsDigits.map((digit, index) => (
              <AnimatedDigit key={index} digit={digit} />
            ))}
          </div>
        </div>

        <PassiveIncomeDisplay incomeRate={passiveIncomeRate} />
      </div>

      <div className="button__wrapper">
        <TapButton onIncrement={handleIncrement} lionImage={lionImage} />
      </div>

      <div className="bottom_actions">
        <EnergyIndicator />
        <BoosterIndicator />
      </div>
    </SharedContainer>
  );
};

export default MainPage;
