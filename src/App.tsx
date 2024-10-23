// src/App.tsx

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./index.css";
import "./App.scss";
import { useUserStore } from "./store/useUserStore";
import useCoinStore from "./store/useCoinStore";
import tg from "./utils/tg"; // Импортируем tg
import LoadingScreen from "./components/UI/LoadingScreen/LoadingScreen";
import axios from "axios"; // Импортируем axios

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeUser, user } = useUserStore();
  const { initializeStore, storeInitialized } = useCoinStore();

  useEffect(() => {
    const initUserAndStore = async () => {
      await initializeUser();
      const { user } = useUserStore.getState();
      if (user && !storeInitialized) {
        initializeStore(user);
      }

      // Получаем start_param из контекста Telegram Web App
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.initDataUnsafe) {
        const startParam = tg.initDataUnsafe.start_param;
        if (startParam && startParam.startsWith("refId") && user) {
          const referrerId = startParam.substring(5); // Извлекаем referrer_id
          const referralId = user.id; // ID текущего пользователя
          // Отправляем POST запрос на ваш сервер
          try {
            const response = await axios.post(
              `https://dev.simatap.ru/api/referrals`,
              {},
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
        }
      }

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
        allow_vertical_swipe: false, // Отключаем все вертикальные свайпы для закрытия
      });
    }

    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
  }, [initializeUser, initializeStore, storeInitialized]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Router basename="/misapat">
      <AppRouter />
    </Router>
  );
};

export default App;
