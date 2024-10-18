// src/components/Header/HeaderModalContent/HeaderModalContent.tsx

import React from "react";
import styles from "./HeaderModalContent.module.scss";
import LicenseModal from "./LicenseModal/LicenseModal";
import RulesModal from "./RulesModal/RulesModal";
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

  const registrationDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("ru-RU")
    : "01.01.2024";

  return (
    <div className={styles.headerModal}>
      <img src={photoUrl} alt="Avatar" className={styles.avatar} />
      <h2 className={styles.nickname}>{user?.username || "Гость"}</h2>
      <p className={styles.userId}>ID: {user?.id}</p>

      <p className={styles.registrationDate}>
        Дата регистрации в приложении: <br /> {registrationDate}
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
