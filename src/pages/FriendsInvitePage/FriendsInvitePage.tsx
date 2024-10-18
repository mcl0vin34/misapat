// src/pages/FriendsInvite/FriendsInvite.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FriendsInvitePage.module.scss";
import getReferralLink from "../../helpers/getReferralLink";
import tg from "../../utils/tg";
import coinIcon from "../../assets/icons/coin.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";
import { toast } from "react-toastify"; // Импортируем toast
import { useUserStore } from "../../store/useUserStore"; // Импортируем хук хранилища

// Типизация для друга
interface Friend {
  username: string;
  coins: number;
}

const FriendsInvite = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const referralLink = getReferralLink();
  const shareReferralLinkText = "Тапай и зарабатывай!";

  const { user } = useUserStore(); // Получаем пользователя из хранилища
  const userId = user?.id;

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

  // Функция для копирования реферальной ссылки
  const handleCopyLink = () => {
    if (navigator.clipboard && window.isSecureContext) {
      // Используем Clipboard API
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          toast.success("Реферальная ссылка скопирована!");
        })
        .catch(() => {
          toast.error("Не удалось скопировать ссылку.");
        });
    } else {
      // Альтернативный способ для незащищенных контекстов
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      // Сделать textarea невидимым
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Реферальная ссылка скопирована!");
      } catch (err) {
        toast.error("Не удалось скопировать ссылку.");
      }

      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    // Проверяем, есть ли userId
    if (!userId) {
      setError("Пользователь не найден.");
      setLoading(false);
      return;
    }

    // Функция для получения данных о друзьях
    const fetchFriends = async () => {
      try {
        const response = await axios.get<Friend[]>(
          `https://stabledissfusion.sima-land.local:7860/api/users/${userId}/referrals`
        );
        setFriends(response.data);
      } catch (error) {
        console.error(error);
        setError("Не удалось загрузить список друзей.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  return (
    <div className={styles.friendsInvite}>
      <div className={styles.scrollContainer}>
        {loading ? (
          <p></p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : friends.length > 0 ? (
          <div className={styles.friendsList}>
            <header>
              <div className={styles.header}>
                <h1 className={styles.header_title}>Друзья</h1>
              </div>

              <div className={styles.rewardBlock}>
                <div className={styles.rewardBlock_top}>
                  <img src={coinIcon} alt="Coin" className={styles.coinIcon} />
                  <p className={styles.rewardBlock_description}>+50 000</p>
                </div>

                <span className={styles.rewardBlock_description_mini}>
                  тебе и другу!
                </span>
              </div>
            </header>

            <p className={styles.friendsList_count}>
              У тебя {friends.length} друзей
            </p>
            <ul>
              {friends.map((friend, index) => (
                <li key={index} className={styles.friendItem}>
                  <span className={styles.friendItem_name}>
                    <span className={styles.friendItem_index}>
                      {index + 1}.
                    </span>
                    {friend.username}
                  </span>

                  <div className={styles.friendItem_text}>
                    <img
                      src={coinIcon}
                      alt="Coin"
                      className={styles.friendCoinIcon}
                    />
                    <span className={styles.friendItem_coins}>
                      {friend.coins.toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.inviteButtons}>
              <button
                onClick={handleShareButtonClick}
                className={styles.inviteFriend}
              >
                Пригласить друга
              </button>
              <button
                onClick={handleCopyLink} // Добавляем обработчик
                className={styles.copyLink}
                title="Скопировать реферальную ссылку" // Добавляем подсказку
              >
                <CopyIcon />
              </button>
            </div>

            <p className={styles.inviteText}>
              Приглашай друга и получайте совместную награду!
            </p>
          </div>
        ) : (
          <div className={styles.friendsList}>
            <header>
              <div className={styles.header}>
                <h1 className={styles.header_title}>Друзья</h1>
              </div>

              <div className={styles.rewardBlock}>
                <div className={styles.rewardBlock_top}>
                  <img src={coinIcon} alt="Coin" className={styles.coinIcon} />
                  <p className={styles.rewardBlock_description}>+50 000</p>
                </div>

                <span className={styles.rewardBlock_description_mini}>
                  тебе и другу!
                </span>
              </div>
            </header>

            <p className={styles.friendsList_count}>У тебя 0 друзей</p>

            <p className={styles.noFriendsMessage}>
              У тебя пока нет друзей. Пригласи друга и получи награду!
            </p>

            <div className={styles.inviteButtons}>
              <button
                onClick={handleShareButtonClick}
                className={styles.inviteFriend}
              >
                Пригласить друга
              </button>
              <button
                onClick={handleCopyLink} // Добавляем обработчик
                className={styles.copyLink}
                title="Скопировать реферальную ссылку" // Добавляем подсказку
              >
                <CopyIcon />
              </button>
            </div>

            <p className={styles.inviteText}>
              Приглашай друга и получайте совместную награду!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsInvite;
