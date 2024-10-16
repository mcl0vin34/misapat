// src/App.tsx

import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./index.css";
import "./App.scss";
import { useUserStore } from "./store/useUserStore";
import useCoinStore from "./store/useCoinStore";

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
  }, []);

  return (
    <Router basename="/misapat">
      <AppRouter />
    </Router>
  );
};

export default App;
