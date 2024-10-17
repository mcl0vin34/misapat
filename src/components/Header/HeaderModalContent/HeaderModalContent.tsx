// src/components/Header/HeaderModalContent/HeaderModalContent.tsx

import React from "react";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import styles from "./HeaderModalContent.module.scss";
import useModalStore from "../../../store/useModalStore";
import getReferralLink from "../../../helpers/getReferralLink";
import tg from "../../../utils/tg";
import photoUrl from "../../../assets/images/avatar.png";

interface HeaderModalContentProps {
  user: any;
}

const HeaderModalContent: React.FC<HeaderModalContentProps> = ({ user }) => {
  const { openModal, closeModal } = useModalStore();

  const openLicenseModal = () => {
    openModal(<LicenseModal />, "#1c1c1c");
  };

  const openRulesModal = () => {
    openModal(<RulesModal />, "#1c1c1c");
  };

  const referralLink = getReferralLink();
  const shareReferralLinkText = "Тапай и зарабатывай!";

  const handleShareButtonClick = () => {
    if (tg && tg.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          referralLink
        )}&text=${encodeURIComponent(shareReferralLinkText)}`
      );
    } else {
      alert("Не удалось открыть Telegram для совместного использования.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        alert("Реферальная ссылка скопирована в буфер обмена!");
      })
      .catch((err) => {
        console.error("Не удалось скопировать ссылку: ", err);
        alert("Не удалось скопировать ссылку.");
      });
  };

  return (
    <div className={styles.headerModal}>
      <img src={photoUrl} alt="Avatar" className={styles.avatar} />
      <h2 className={styles.nickname}>{user?.username || "Гость"}</h2>
      <p className={styles.userId}>ID: {user?.id}</p>

      <p className={styles.registrationDate}>
        Дата регистрации в приложении: <br />{" "}
        {user?.registrationDate || "01.01.2024"}
      </p>

      <div className={styles.sections}>
        <button className={styles.linkButton} onClick={openLicenseModal}>
          Лицензионное соглашение
        </button>
        <button className={styles.linkButton} onClick={openRulesModal}>
          Правила игры
        </button>
      </div>

      <div className={styles.shareSection}>
        <button
          className={styles.shareTelegramButton}
          onClick={handleShareButtonClick}
        >
          Пригласить друга
        </button>
      </div>
    </div>
  );
};

export default HeaderModalContent;

// Компонент модалки для правил игры
const RulesModal: React.FC = () => {
  const { closeModal } = useModalStore();

  return (
    <div className={`${styles.modal_wrapper} ${styles.rulesModal}`}>
      <h2 className={styles.modalTitle}>Правила Игры</h2>
      <p className={styles.modalDescription}>
        {/* Ваш текст правил */}
        Цель игры: Набрать максимальное количество очков или ресурсов, нажимая
        (тапая) на экран в течение ограниченного времени или по определённым
        правилам...
      </p>
    </div>
  );
};

// Компонент модалки для лицензионного соглашения
const LicenseModal: React.FC = () => {
  const { closeModal } = useModalStore();

  return (
    <div className={`${styles.modal_wrapper} ${styles.licenseModal}`}>
      <h2 className={styles.modalTitle}>Лицензионное соглашение</h2>
      <p className={styles.modalDescription}>
        {/* Ваш текст лицензионного соглашения */}
        Лицензионное Соглашение Пользователя (EULA) для Игры "Simatap" Последнее
        обновление: 14.10.2024 Пожалуйста, внимательно прочитайте это
        Лицензионное Соглашение (далее - "Соглашение") перед использованием игры
        "Simatap" (далее - "Игра")...
      </p>
    </div>
  );
};
