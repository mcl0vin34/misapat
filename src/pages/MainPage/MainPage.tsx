// src/pages/MainPage/MainPage.tsx
import React from "react";
import lionImage from "../../assets/images/lion.png";
import coinIcon from "../../assets/icons/coin.svg";
import "./MainPage.scss";
import TapButton from "../../components/TapButton/TapButton";
import PassiveIncomeDisplay from "../../components/UI/PassiveIncomeDisplay/PassiveIncomeDisplay";
import useCoinStore from "../../store/useCoinStore";
import EnergyIndicator from "../../components/UI/EnergyIndicator/EnergyIndicator";
import BoosterIndicator from "../../components/UI/BoosterIndicator/BoosterIndicator";
import FormattedNumber from "../../components/UI/FormattedNumber/FormattedNumber";

const MainPage = () => {
  const { coins, passiveIncomeRate } = useCoinStore();

  return (
    <div className="main-page-content">
      <div className="coin-display">
        <div className="coin-display_wrapper">
          <img src={coinIcon} alt="Coin" className="coin-icon" />
          <div className="coin-count">
            <FormattedNumber number={Math.floor(coins)} />
          </div>
        </div>

        <PassiveIncomeDisplay incomeRate={passiveIncomeRate} />
      </div>

      <div className="button__wrapper">
        <TapButton lionImage={lionImage} />
      </div>

      <div className="bottom_actions">
        <EnergyIndicator />
        <BoosterIndicator />
      </div>
    </div>
  );
};

export default MainPage;
