// src/pages/FriendsInvite/FriendsInvite.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SharedContainer from "../../components/UI/SharedContainer/SharedContainer";
import styles from "./FriendsInvitePage.module.scss";
import coinIcon from "../../assets/icons/coin.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";

// Типизация для друга
interface Friend {
  name: string;
  coins?: number; // Сделаем свойство coins необязательным
}

const FriendsInvite = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Функция для получения данных о друзьях
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          "https://a4429e27fbaa3135.mokky.dev/friends"
        );
        setFriends(response.data);
      } catch (error) {
        setError("Не удалось загрузить список друзей.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <SharedContainer>
      <div className={styles.friendsInvite}>
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

        <div className={styles.scrollContainer}>
          {loading ? (
            <p>Загрузка...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : friends.length > 0 ? (
            <div className={styles.friendsList}>
              <p className={styles.friendsList_count}>
                У тебя {friends.length} друзей
              </p>
              <ul>
                {friends.map((friend, index) => (
                  <li key={index} className={styles.friendItem}>
                    <span className={styles.friendItem_name}>
                      {index + 1}. {friend.name}
                    </span>

                    <div className={styles.friendItem_text}>
                      <span className={styles.friendItem_coins}>
                        {friend.coins?.toLocaleString() || "0"}
                      </span>
                      <img
                        src={coinIcon}
                        alt="Coin"
                        className={styles.friendCoinIcon}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.noFriendsMessage}>
              У тебя пока нет друзей. Пригласи друга и получи награду!
            </p>
          )}
        </div>

        <div className={styles.inviteButtons}>
          <button className={styles.inviteFriend}>Пригласить друга</button>
          <button className={styles.copyLink}>
            <CopyIcon />
          </button>
        </div>

        <p className={styles.inviteText}>
          Приглашай друга и получайте совместную награду!
        </p>
      </div>
    </SharedContainer>
  );
};

export default FriendsInvite;
