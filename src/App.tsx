// src/App.tsx

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./index.css";
import "./App.scss";
import { useUserStore } from "./store/useUserStore";
import useCoinStore from "./store/useCoinStore";
import tg from "./utils/tg"; // Импортируем tg
import LoadingScreen from "./components/UI/LoadingScreen/LoadingScreen"; // Импортируем LoadingScreen

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeUser, user, isLoading: isUserLoading } = useUserStore();
  const { initializeStore, storeInitialized } = useCoinStore();

  useEffect(() => {
    const initUserAndStore = async () => {
      await initializeUser();
      const { user } = useUserStore.getState();
      if (user && !storeInitialized) {
        initializeStore(user);
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

    // Проверяем значение process.env.NODE_ENV
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