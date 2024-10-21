import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "../components/FooterNav/FooterNav";
import Header from "../components/Header/Header";
import useModalStore from "../store/useModalStore";
import Modal from "../components/UI/Modal/Modal";
import useCoinStore from "../store/useCoinStore";
import SharedContainer from "../components/UI/SharedContainer/SharedContainer";
import { useUserStore } from "../store/useUserStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Импорт стилей toast
import "./Layout.scss";

const Layout = () => {
  const { modalStack, closeModal } = useModalStore();
  const { initializeUser, user, isLoading } = useUserStore();

  const {
    offlineIncome,
    setOfflineIncome,
    initializeStore: initializeCoinStore,
  } = useCoinStore();

  // Инициализация пользователя при запуске приложения
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    if (user) {
      initializeCoinStore(user);
    }
  }, [user, initializeCoinStore]);

  // Обработка оффлайн дохода
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
      {/* Рендерим все модальные окна из стека */}
      {modalStack.map(({ content, backgroundColor }, index) => (
        <Modal
          key={index}
          isOpen={true}
          onClose={() => closeModal()}
          backgroundColor={backgroundColor}
        >
          {content}
        </Modal>
      ))}

      <ToastContainer />
    </div>
  );
};

export default Layout;
