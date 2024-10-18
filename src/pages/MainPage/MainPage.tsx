// src/pages/MainPage/MainPage.tsx

import React from "react";
import lionImage from "../../assets/images/lion.png";
import coinIcon from "../../assets/icons/coin.svg";
import "./MainPage.scss";
import TapButton from "../../components/TapButton/TapButton";
import PassiveIncomeDisplay from "../../components/PassiveIncomeDisplay/PassiveIncomeDisplay";
import useCoinStore from "../../store/useCoinStore";
import EnergyIndicator from "../../components/EnergyIndicator/EnergyIndicator";
import BoosterIndicator from "../../components/BoosterIndicator/BoosterIndicator";
import FormattedNumber from "../../components/UI/FormattedNumber/FormattedNumber";
import SharedContainer from "../../components/UI/SharedContainer/SharedContainer";

const MainPage = () => {
  const { coins, passiveIncomeRate } = useCoinStore();

  return (
    <SharedContainer>
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
    </SharedContainer>
  );
};

export default MainPage;
