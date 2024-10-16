import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "../components/FooterNav/FooterNav";
import Header from "../components/Header/Header";
import useModalStore from "../store/useModalStore";
import Modal from "../components/UI/Modal/Modal";
import useCoinStore from "../store/useCoinStore";
import { useUserStore } from "../store/useUserStore";
import "./Layout.scss";

const Layout = () => {
  const { modalStack, closeModal } = useModalStore();
  const isModalOpen = modalStack.length > 0;
  const modalContent = modalStack[modalStack.length - 1];

  const {
    startPassiveIncome,
    stopPassiveIncome,
    startEnergyRecovery,
    stopEnergyRecovery,
    calculateOfflineIncome,
    calculateEnergyRestoration, // добавляем метод для восстановления энергии
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
    calculateEnergyRestoration, // не забудьте добавить сюда зависимость
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
        </div>
      );
    }
  }, [offlineIncome, setOfflineIncome]);

  // Layout.tsx
  return (
    <div className="layout">
      <Header />
      <div className="content-wrapper">
        <main>
          <Outlet />
        </main>
        <FooterNav />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Layout;
