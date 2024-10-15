import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "../components/FooterNav/FooterNav";
import Header from "../components/Header/Header"; // Импортируем Header
import useModalStore from "../store/useModalStore";
import Modal from "../components/UI/Modal/Modal"; // Импортируем компонент Modal
import useCoinStore from "../store/useCoinStore"; // Импортируем useCoinStore
import { useUserStore } from "../store/useUserStore"; // Импортируем стор для пользователя
import "./Layout.scss";

const Layout = () => {
  const { isModalOpen, modalContent, closeModal } = useModalStore();
  const {
    startPassiveIncome,
    stopPassiveIncome,
    startEnergyRecovery,
    stopEnergyRecovery,
    calculateOfflineIncome,
    setLastActiveTime,
    offlineIncome,
    setOfflineIncome,
    coins,
    incrementCoins,
  } = useCoinStore();

  const { initializeUser } = useUserStore(); // Достаем функцию инициализации пользователя

  useEffect(() => {
    initializeUser(); // Инициализация пользователя при запуске приложения
  }, [initializeUser]);

  useEffect(() => {
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
    setLastActiveTime,
  ]);

  useEffect(() => {
    if (offlineIncome > 0) {
      // Открываем модальное окно через глобальный store
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

  return (
    <div className="layout">
      <Header /> {/* Добавляем Header */}
      <main>
        <Outlet />
      </main>
      <FooterNav />
      {/* Рендерим компонент Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Layout;
