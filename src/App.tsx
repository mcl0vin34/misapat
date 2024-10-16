// src/App.tsx

import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./index.css";
import "./App.scss";
import { useUserStore } from "./store/useUserStore";
import useCoinStore from "./store/useCoinStore";
import tg from "./utils/tg"; // Импортируем tg

const App: React.FC = () => {
  const { initializeUser, user } = useUserStore();
  const { initializeStore, storeInitialized } = useCoinStore();

  useEffect(() => {
    const initUserAndStore = async () => {
      await initializeUser();
      const { user } = useUserStore.getState();
      if (user && !storeInitialized) {
        initializeStore(user);
      }
    };
    initUserAndStore();

    // Разворачиваем приложение в полный экран
    if (tg?.expand) {
      tg.expand();
    }

    // Проверяем значение process.env.NODE_ENV
    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
  }, []);

  return (
    <Router basename="/misapat">
      <AppRouter />
    </Router>
  );
};

export default App;
