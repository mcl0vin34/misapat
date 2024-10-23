import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FriendsInvitePage.module.scss";
import getReferralLink from "../../helpers/getReferralLink";
import tg from "../../utils/tg";
import coinIcon from "../../assets/icons/coin.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";
import { toast } from "react-toastify";
import { useUserStore } from "../../store/useUserStore";

// Обновленный интерфейс Friend
interface Friend {
  username: string;
  totalCoins: number;
}

const FriendsInvite = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const referralLink = getReferralLink();
  const shareReferralLinkText = "Тапай и зарабатывай!";
  const { user } = useUserStore();
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

  const handleCopyLink = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          toast.success("Реферальная ссылка скопирована!", {
            icon: <CopyIcon style={{ width: 24, height: 24 }} />,
            style: { backgroundColor: "#2d3236", color: "#ffffff" },
            autoClose: 1000,
          });
        })
        .catch(() => {
          toast.error("Не удалось скопировать ссылку.", {
            icon: <CopyIcon style={{ width: 24, height: 24 }} />,
            style: { backgroundColor: "#ff4d4f", color: "#ffffff" },
            autoClose: 1000,
          });
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Реферальная ссылка скопирована!", {
          icon: <CopyIcon style={{ width: 24, height: 24 }} />,
          style: { backgroundColor: "#2d3236", color: "#ffffff" },
          autoClose: 1000,
        });
      } catch (err) {
        toast.error("Не удалось скопировать ссылку.", {
          icon: <CopyIcon style={{ width: 24, height: 24 }} />,
          style: { backgroundColor: "#ff4d4f", color: "#ffffff" },
          autoClose: 1000,
        });
      }

      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("Пользователь не найден.");
      setLoading(false);
      return;
    }

    const fetchFriends = async () => {
      try {
        const response = await axios.get<Friend[]>(
          `https://dev.simatap.ru/api/referrals/${userId}`
        );
        setFriends(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Если сервер вернул 404, считаем, что друзей нет
          setFriends([]);
        } else {
          console.error(error);
          setError("Не удалось загрузить список друзей.");
        }
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
          <p>Загрузка...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.friendsList}>
            <div>
              <header>
                <div className={styles.header}>
                  <h1 className={styles.header_title}>Друзья</h1>
                </div>

                <div className={styles.rewardBlock}>
                  <div className={styles.rewardBlock_top}>
                    <img
                      src={coinIcon}
                      alt="Coin"
                      className={styles.coinIcon}
                    />
                    <p className={styles.rewardBlock_description}>+50 000</p>
                  </div>

                  <span className={styles.rewardBlock_description_mini}>
                    тебе и другу!
                  </span>
                </div>

                <p className={styles.friendsList_count}>
                  У тебя {friends.length} друзей
                </p>
              </header>

              {friends.length > 0 ? (
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
                          {friend.totalCoins.toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noFriendsMessage}>
                  У тебя пока нет друзей. Пригласи друга и получи награду!
                </p>
              )}
            </div>

            <div className={styles.inviteButtons}>
              <div className={styles.inviteButtons_block}>
                <button
                  onClick={handleShareButtonClick}
                  className={styles.inviteFriend}
                >
                  Пригласить друга
                </button>
                <button
                  onClick={handleCopyLink}
                  className={styles.copyLink}
                  title="Скопировать реферальную ссылку"
                >
                  <CopyIcon />
                </button>
              </div>
              <p className={styles.inviteText}>
                Приглашай друга и получайте совместную награду!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsInvite;
