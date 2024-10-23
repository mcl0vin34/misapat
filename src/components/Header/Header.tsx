import React from "react";
import "./Header.scss";
import { useLocation } from "react-router-dom";
import useModalStore from "../../store/useModalStore";
import { useUserStore } from "../../store/useUserStore";
import useCoinStore from "../../store/useCoinStore";
import photoUrl from "../../assets/images/avatar.png";
import HeaderModalContent from "./HeaderModalContent/HeaderModalContent";
import FormattedNumberHeader from "../UI/FormattedNumberHeader/FormattedNumberHeader";

const Header: React.FC = () => {
  const { openModal } = useModalStore();
  const { user } = useUserStore();
  const { coins } = useCoinStore();
  const location = useLocation();

  const handleClick = () => {
    openModal(<HeaderModalContent user={user} />);
  };

  // Определяем, является ли текущая страница главной
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`header ${isHomePage ? "header--home" : "header--default"}`}
      onClick={handleClick}
    >
      {!isHomePage && <FormattedNumberHeader number={Math.floor(coins || 0)} />}
      <div className="header__wrapper">
        <span className="header__nickname">{user?.username || "Гость"}</span>
        <img src={photoUrl} alt="Avatar" className="header__avatar" />
      </div>
    </header>
  );
};

export default Header;
