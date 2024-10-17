// src/components/Header/Header.tsx
import React from "react";
import "./Header.scss";
import useModalStore from "../../store/useModalStore";
import { useUserStore } from "../../store/useUserStore"; // Импортируем стор пользователя
import photoUrl from "../../assets/images/avatar.png";
import HeaderModalContent from "./HeaderModalContent/HeaderModalContent"; // Убедитесь, что путь правильный

const Header: React.FC = () => {
  const { openModal } = useModalStore();
  const { user } = useUserStore(); // Получаем данные пользователя из стора

  const handleClick = () => {
    openModal(<HeaderModalContent user={user} />);
  };

  return (
    <header className="header" onClick={handleClick}>
      <span className="header__nickname">{user?.username || "Гость"}</span>
      <img src={photoUrl} alt="Avatar" className="header__avatar" />
    </header>
  );
};

export default Header;
