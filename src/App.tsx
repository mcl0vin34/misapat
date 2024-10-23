// src/App.tsx

import React, { useEffect, useState, createContext, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./index.css";
import "./App.scss";
import { useUserStore } from "./store/useUserStore";
import useCoinStore from "./store/useCoinStore";
import LoadingScreen from "./components/UI/LoadingScreen/LoadingScreen";
import axios from "axios";

export const CoinEffectContext = createContext({
  triggerCoinEffect: () => {},
});

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeUser, user } = useUserStore();
  const { initializeStore, storeInitialized } = useCoinStore();

  const triggerCoinEffect = useCallback(() => {
    console.log("Coin effect triggered!");
  }, []);

  useEffect(() => {
    const initUserAndStore = async () => {
      await initializeUser();
      const { user } = useUserStore.getState();
      if (user && !storeInitialized) {
        initializeStore(user);
      }

      // Инициализируем объект tg
      const tg = (window as any).Telegram?.WebApp;

      // Получаем start_param из контекста Telegram Web App или из URL
      let startParam = tg?.initDataUnsafe?.start_param;

      if (!startParam) {
        const urlParams = new URLSearchParams(window.location.search);
        startParam =
          urlParams.get("startapp") || urlParams.get("tgWebAppStartParam");
      }

      console.log("startParam:", startParam);
      console.log("user:", user);

      if (startParam && startParam.startsWith("refId") && user) {
        const referrerId = startParam.substring(5); // Извлекаем referrer_id
        const referralId = user.id; // ID текущего пользователя
        console.log("referrerId:", referrerId);
        console.log("referralId:", referralId);

        // Отправляем POST запрос на ваш сервер
        try {
          const response = await axios.post(
            `https://dev.simatap.ru/api/referrals`,
            {}, // Тело запроса, если необходимо
            {
              params: {
                referrer_id: referrerId,
                referral_id: referralId,
              },
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Referral data sent successfully:", response.data);
        } catch (error) {
          console.error("Error sending referral data:", error);
        }
      } else {
        console.log("No valid startParam or user is not initialized.");
      }

      setIsInitialized(true);
    };
    initUserAndStore();

    // Разворачиваем приложение в полный экран
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.expand) {
      tg.expand();
      tg.disableVerticalSwipes();
      tg.isVerticalSwipesEnabled = false;
      tg.bg_color = "#272727";
    }

    // Настройка поведения свайпа
    if (tg?.web_app_setup_swipe_behavior) {
      tg.web_app_setup_swipe_behavior({
        allow_vertical_swipe: false, // Отключаем все вертикальные свайпы для закрытия
      });
    }

    // Проверяем значение process.env.NODE_ENV
    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
  }, [initializeUser, initializeStore, storeInitialized]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <CoinEffectContext.Provider value={{ triggerCoinEffect }}>
      <Router basename="/misapat">
        <AppRouter />
      </Router>
    </CoinEffectContext.Provider>
  );
};

export default App;
