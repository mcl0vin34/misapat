// src/App.tsx
import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./index.css";
import "./App.scss";
import { useUserStore } from "./store/useUserStore";
import useCoinStore from "./store/useCoinStore";
import tg from "./utils/tg";
import LoadingScreen from "./components/UI/LoadingScreen/LoadingScreen";
import axios from "axios";
import CoinEffect from "./components/UI/CoinEffect/CoinEffect";

// Создаем контекст для управления эффектом монет
export const CoinEffectContext = createContext({
  triggerCoinEffect: () => {},
});

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCoinEffect, setShowCoinEffect] = useState(false);
  const { initializeUser, user } = useUserStore();
  const { initializeStore, storeInitialized } = useCoinStore();

  useEffect(() => {
    const initUserAndStore = async () => {
      await initializeUser();
      const { user } = useUserStore.getState();
      if (user && !storeInitialized) {
        initializeStore(user);
      }

      // Ваш код для работы с Telegram Web App

      setIsInitialized(true);
    };
    initUserAndStore();

    // Разворачиваем приложение в полный экран
    if (tg?.expand) {
      tg.expand();
      tg.disableVerticalSwipes();
      tg.isVerticalSwipesEnabled = false;
      tg.bg_color = "#272727";
    }

    // Настройка поведения свайпа
    if (tg?.web_app_setup_swipe_behavior) {
      tg.web_app_setup_swipe_behavior({
        allow_vertical_swipe: false,
      });
    }

    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
  }, [initializeUser, initializeStore, storeInitialized]);

  const triggerCoinEffect = () => {
    setShowCoinEffect(true);
  };

  const handleCoinEffectComplete = () => {
    setShowCoinEffect(false);
  };

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <CoinEffectContext.Provider value={{ triggerCoinEffect }}>
      {showCoinEffect && <CoinEffect onComplete={handleCoinEffectComplete} />}
      <Router basename="/misapat">
        <AppRouter />
      </Router>
    </CoinEffectContext.Provider>
  );
};

export default App;
