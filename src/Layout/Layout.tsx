// src/layout/Layout.tsx

import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "../components/FooterNav/FooterNav";
import Header from "../components/Header/Header";
import useModalStore from "../store/useModalStore";
import Modal from "../components/UI/Modal/Modal";
import useCoinStore from "../store/useCoinStore";
import SharedContainer from "../components/UI/SharedContainer/SharedContainer";
import { useUserStore } from "../store/useUserStore";
import "./Layout.scss";

const Layout = () => {
  const { modalStack, closeModal } = useModalStore();
  const topModal = modalStack[modalStack.length - 1];

  const {
    startPassiveIncome,
    stopPassiveIncome,
    startEnergyRecovery,
    stopEnergyRecovery,
    calculateOfflineIncome,
    calculateEnergyRestoration,
    setLastActiveTime,
    offlineIncome,
    setOfflineIncome,
    coins,
    incrementCoins,
  } = useCoinStore();

  const { initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser(); // Инициализация пользователя при запуске приложения
  }, [initializeUser]);

  useEffect(() => {
    calculateEnergyRestoration(); // Восстанавливаем энергию при загрузке приложения
    calculateOfflineIncome();
    setLastActiveTime(Date.now());

    startPassiveIncome();
    startEnergyRecovery();

    const handleBeforeUnload = () => {
      setLastActiveTime(Date.now());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      stopPassiveIncome();
      stopEnergyRecovery();
      setLastActiveTime(Date.now());
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    startPassiveIncome,
    startEnergyRecovery,
    stopPassiveIncome,
    stopEnergyRecovery,
    calculateOfflineIncome,
    calculateEnergyRestoration,
    setLastActiveTime,
  ]);

  useEffect(() => {
    if (offlineIncome > 0) {
      useModalStore.getState().openModal(
        <div>
          <h2 style={{ color: "#fff", marginBottom: "20px" }}>Вы вернулись!</h2>
          <p style={{ color: "#fff", marginBottom: "20px" }}>
            Пока вас не было, вы заработали {Math.floor(offlineIncome)} монет.
          </p>
          <button
            style={{ background: "#fff", color: "black" }}
            onClick={() => {
              useModalStore.getState().closeModal();
              setOfflineIncome(0);
            }}
          >
            Забрать награду
          </button>
        </div>,
        "linear-gradient(180deg, #2D3236 0%, #000000 100%)"
      );
    }
  }, [offlineIncome, setOfflineIncome]);

  return (
    <div className="layout">
      <Header />
      <div className="content-wrapper">
        <SharedContainer>
          <Outlet />
        </SharedContainer>
      </div>
      <FooterNav />
      {/* Рендерим все модальные окна из стэка */}
      {modalStack.map((modalContent, index) => (
        <Modal key={index} isOpen={true} onClose={() => closeModal()}>
          {modalContent}
        </Modal>
      ))}
    </div>
  );
};

export default Layout;
