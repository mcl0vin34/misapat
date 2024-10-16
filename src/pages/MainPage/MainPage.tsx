// src/pages/MainPage/MainPage.tsx
import React, { useEffect, useState } from "react";
import lionImage from "../../assets/images/lion.png";
import coinIcon from "../../assets/icons/coin.svg";
import "./MainPage.scss";
import TapButton from "../../components/TapButton/TapButton";
import PassiveIncomeDisplay from "../../components/PassiveIncomeDisplay/PassiveIncomeDisplay";
import useCoinStore from "../../store/useCoinStore";
import EnergyIndicator from "../../components/EnergyIndicator/EnergyIndicator";
import BoosterIndicator from "../../components/BoosterIndicator/BoosterIndicator";
import AnimatedDigit from "../../components/UI/AnimatedDigit/AnimatedDigit";
import SharedContainer from "../../components/UI/SharedContainer/SharedContainer";

const MainPage = () => {
  const { coins, passiveIncomeRate } = useCoinStore(); // Вы можете удалить неиспользуемые методы

  const [prevCoins, setPrevCoins] = useState(coins);

  useEffect(() => {
    if (coins !== prevCoins) {
      setPrevCoins(coins);
    }
  }, [coins, prevCoins]);

  const coinsString = Math.floor(coins).toString();
  const prevCoinsString = Math.floor(prevCoins).toString();

  const maxLength = Math.max(coinsString.length, prevCoinsString.length);
  const formattedCoins = coinsString.padStart(maxLength, "0");
  const formattedPrevCoins = prevCoinsString.padStart(maxLength, "0");

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

        {/* Передаем корректное значение passiveIncomeRate */}
        <PassiveIncomeDisplay incomeRate={passiveIncomeRate} />
      </div>

      <div className="button__wrapper">
        <TapButton lionImage={lionImage} /> {/* Убрали onIncrement */}
      </div>

      <div className="bottom_actions">
        <EnergyIndicator />
        <BoosterIndicator />
      </div>
    </SharedContainer>
  );
};

export default MainPage;
