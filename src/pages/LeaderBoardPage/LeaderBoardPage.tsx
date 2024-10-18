// LeaderBoardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LeaderBoardPage.module.scss";

// Импортируем PNG как обычные изображения
import firstPlaceIcon from "../../assets/icons/first-place.png";
import secondPlaceIcon from "../../assets/icons/second-place.png";
import thirdPlaceIcon from "../../assets/icons/third-place.png";

// Импортируем SVG иконку рубля
import { ReactComponent as RubleIcon } from "../../assets/icons/ruble.svg";

// Импортируем Skeleton из react-loading-skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Импортируем хук для доступа к пользователю из стора
import { useUserStore } from "../../store/useUserStore";

// Определяем типы данных
interface LeaderboardUser {
  rank: number;
  username: string;
  coins: number;
  isCurrentUser: boolean;
}

interface CurrentUser {
  rank: number;
  username: string;
  coins: number;
  isTop50: boolean;
}

interface ApiResponse {
  top50: LeaderboardUser[];
  currentUser: CurrentUser;
}

const LeaderBoardPage: React.FC = () => {
  // Получаем текущего пользователя из стора
  const { user, isLoading: userLoading } = useUserStore();
  const userId = user?.id;

  const [top50, setTop50] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения данных лидерборда
  const fetchLeaderboard = async () => {
    if (!userId) {
      setError("Пользователь не авторизован.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `https://stabledissfusion.sima-land.local:7860/api/users/leaders`,
        {
          params: {
            userId: userId,
          },
        }
      );

      const data = response.data;
      setTop50(data.top50);
      setCurrentUser(data.currentUser);
    } catch (err: any) {
      console.error(err);
      setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [userId]);

  if (loading || userLoading) {
    return (
      <div className={styles.leaderboard}>
        <main className={styles.mainContent}>
          <h2 className={styles.heading}>
            <Skeleton width={200} />
          </h2>
          <p className={styles.subtitle}>
            <Skeleton width={400} />
          </p>

          <div className={styles.rewards}>
            <div className={`${styles.reward} ${styles.second_place}`}>
              <Skeleton height={46} width={46} />
              <div className={styles.rewardAmount}>
                <Skeleton circle height={30} width={30} />
                <Skeleton width={50} />
              </div>
            </div>

            <div className={`${styles.reward} ${styles.first_place}`}>
              <Skeleton height={54} width={54} />
              <div className={styles.rewardAmount}>
                <Skeleton circle height={30} width={30} />
                <Skeleton width={50} />
              </div>
            </div>

            <div className={`${styles.reward} ${styles.third_place}`}>
              <Skeleton height={46} width={46} />
              <div className={styles.rewardAmount}>
                <Skeleton circle height={30} width={30} />
                <Skeleton width={50} />
              </div>
            </div>
          </div>

          <div className={styles.leaderboardList}>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`${styles.leaderboardItem} ${
                  index < 3 ? styles.top3 : ""
                }`}
              >
                <span className={styles.rank}>
                  <Skeleton width={30} />
                </span>
                <span className={styles.name}>
                  <Skeleton width={150} />
                </span>
                <div className={styles.rewardAmount}>
                  <Skeleton circle height={30} width={30} />
                  <Skeleton width={80} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.leaderboard}>
        <main className={styles.mainContent}>
          <h2 className={styles.heading}>Рейтинг</h2>
          <p className={styles.subtitle}>
            Занимай первые места в рейтинге за неделю и получай денежное
            вознаграждение
          </p>
          <div className={styles.error}>{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.leaderboard}>
      <main className={styles.mainContent}>
        <h2 className={styles.heading}>Рейтинг</h2>
        <p className={styles.subtitle}>
          Занимай первые места в рейтинге за неделю и получай денежное
          вознаграждение
        </p>

        {/* Размещение медалей: второе слева, первое по центру, третье справа */}
        <div className={styles.rewards}>
          {/* Второе место */}
          {top50[1] && (
            <div className={`${styles.reward} ${styles.second_place}`}>
              <img src={secondPlaceIcon} alt="Второе место" />
              <div className={styles.rewardAmount}>
                <RubleIcon className={styles.rubleIcon} />
                <p className={styles.reward_count}>2 500₽</p>
              </div>
            </div>
          )}

          {/* Первое место */}
          {top50[0] && (
            <div className={`${styles.reward} ${styles.first_place}`}>
              <img src={firstPlaceIcon} alt="Первое место" />
              <div className={styles.rewardAmount}>
                <RubleIcon className={styles.rubleIcon} />
                <p className={styles.reward_count}>5 000₽</p>
              </div>
            </div>
          )}

          {/* Третье место */}
          {top50[2] && (
            <div className={`${styles.reward} ${styles.third_place}`}>
              <img src={thirdPlaceIcon} alt="Третье место" />
              <div className={styles.rewardAmount}>
                <RubleIcon className={styles.rubleIcon} />
                <p className={styles.reward_count}>1 000₽</p>
              </div>
            </div>
          )}
        </div>

        {/* Список топ-50 пользователей */}
        <div className={styles.leaderboardList}>
          {top50.map((user) => {
            const isTop3 = user.rank <= 3;
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.rank}
                className={`${styles.leaderboardItem} ${
                  isTop3 ? styles.top3 : ""
                } ${isCurrentUser ? styles.currentUser : ""}`}
              >
                <span className={styles.rank}>#{user.rank}</span>
                <span className={styles.name}>{user.username}</span>
                <div className={styles.rewardAmount}>
                  {/* Рендерим RubleIcon только для топ-3 */}
                  {isTop3 && (
                    <RubleIcon
                      className={`${styles.rubleIcon} ${
                        user.rank === 2
                          ? styles.silverRuble
                          : user.rank === 3
                          ? styles.bronzeRuble
                          : ""
                      }`}
                    />
                  )}
                  <span className={styles.score}>
                    {user.coins.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Отображаем текущего пользователя отдельно, если он не в топ-50 */}
          {currentUser && !currentUser.isTop50 && (
            <div className={styles.currentUser}>
              <span className={styles.rank}>#{currentUser.rank}</span>
              <span className={styles.name}>{currentUser.username}</span>
              <div className={styles.rewardAmount}>
                <RubleIcon className={styles.rubleIcon} />
                <span className={styles.score}>
                  {currentUser.coins.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaderBoardPage;
