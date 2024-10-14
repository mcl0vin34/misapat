// src/layouts/Layout.tsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "../components/FooterNav/FooterNav";
import Header from "../components/Header/Header"; // Импортируем Header
import useModalStore from "../store/useModalStore";
import Modal from "../components/UI/Modal/Modal"; // Импортируем компонент Modal
import useCoinStore from "../store/useCoinStore"; // Импортируем useCoinStore
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
        <>
          <h2>Вы вернулись!</h2>
          <p>
            Пока вас не было, вы заработали {Math.floor(offlineIncome)} монет.
          </p>
          <button
            onClick={() => {
              useModalStore.getState().closeModal();
              setOfflineIncome(0);
            }}
          >
            Забрать награду
          </button>
        </>
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
