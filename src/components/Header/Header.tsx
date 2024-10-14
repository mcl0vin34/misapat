// src/components/Header/Header.tsx
import React from "react";
import "./Header.scss";
import avatar from "../../assets/images/avatar.png"; // Замените на путь к вашей аватарке
import useModalStore from "../../store/useModalStore";

const Header: React.FC = () => {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal(<HeaderModalContent />);
  };

  return (
    <header className="header" onClick={handleClick}>
      <span className="header__nickname">muamee4ever</span>
      <img src={avatar} alt="Avatar" className="header__avatar" />
    </header>
  );
};

export default Header;

// Компонент содержимого модального окна
const HeaderModalContent: React.FC = () => {
  const { closeModal } = useModalStore();

  return (
    <div className="header-modal">
      <img src={avatar} alt="Avatar" className="header-modal__avatar" />
      <h2 className="header-modal__nickname">muamee4ever</h2>
      <p className="header-modal__id">Wvtqtk8o5q</p>

      <p className="header-modal__registration">
        Дата регистрации в приложении: <br /> 01.01.2024
      </p>

      <div className="header-modal__sections">
        <a href="/how-to-play" className="header-modal__link">
          Как играть
        </a>
        <a href="/license" className="header-modal__link">
          Лицензионное соглашение
        </a>
      </div>

      <button
        className="header-modal__share-button"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Ссылка профиля скопирована!");
        }}
      >
        Поделиться профилем
      </button>
    </div>
  );
};
