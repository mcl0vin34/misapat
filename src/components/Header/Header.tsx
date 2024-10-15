import React from "react";
import "./Header.scss";
import useModalStore from "../../store/useModalStore";
import { useUserStore } from "../../store/useUserStore"; // Импортируем стор пользователя

const Header: React.FC = () => {
  const { openModal } = useModalStore();
  const { user } = useUserStore(); // Получаем данные пользователя из стора

  const handleClick = () => {
    openModal(<HeaderModalContent user={user} />);
  };

  return (
    <header className="header" onClick={handleClick}>
      <span className="header__nickname">{user?.username || "Гость"}</span>
      <img
        src={user?.photo_url || "path/to/default/avatar.png"}
        alt="Avatar"
        className="header__avatar"
      />
    </header>
  );
};

export default Header;

// Компонент содержимого модального окна
const HeaderModalContent: React.FC<{ user: any }> = ({ user }) => {
  const { closeModal } = useModalStore();

  return (
    <div className="header-modal">
      <img
        src={user?.photo_url || "path/to/default/avatar.png"}
        alt="Avatar"
        className="header-modal__avatar"
      />
      <h2 className="header-modal__nickname">{user?.username || "Гость"}</h2>
      <p className="header-modal__id">{user?.id}</p>

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
