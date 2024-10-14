// LeaderBoardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SharedContainer from "../../components/UI/SharedContainer/SharedContainer";
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

// Определяем типы данных
interface UserInfo {
  user_id: string;
  username: string; // Новое поле
  leaderboard_position: number;
  coins_count: number;
}

interface LeaderboardUser {
  user_id: string;
  username: string; // Новое поле
  leaderboard_position: number;
  coins_count: number;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_users: number;
}

interface LeaderboardData {
  user_info: UserInfo;
  leaderboard: LeaderboardUser[];
  pagination: Pagination;
}

interface ApiResponse {
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    remaining_count: number;
  };
  items: LeaderboardData[];
}

const LeaderBoardPage: React.FC = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchLeaderboard = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `https://a4429e27fbaa3135.mokky.dev/leaderboard?page=${page}`
      );

      if (response.data.items.length > 0) {
        setData(response.data.items[0]); // Данные внутри "items", берем первый элемент
      } else {
        setError("Данные отсутствуют.");
      }
    } catch (err) {
      setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (data && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.pagination.total_pages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <SharedContainer>
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
      </SharedContainer>
    );
  }

  if (error) {
    return (
      <SharedContainer>
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
      </SharedContainer>
    );
  }

  if (!data) {
    return null; // Для предотвращения рендеринга до того, как данные будут получены
  }

  const { user_info, leaderboard, pagination } = data;

  return (
    <SharedContainer>
      <div className={styles.leaderboard}>
        <main className={styles.mainContent}>
          <h2 className={styles.heading}>Рейтинг</h2>
          <p className={styles.subtitle}>
            Занимай первые места в рейтинге за неделю и получай денежное
            вознаграждение
          </p>

          <div className={styles.rewards}>
            {/* Топ-3 награды */}
            <div className={`${styles.reward} ${styles.second_place}`}>
              <img src={secondPlaceIcon} alt="Second place" />
              <div className={styles.rewardAmount}>
                <RubleIcon
                  className={`${styles.rubleIcon} ${styles.silverRuble}`}
                />
                <p className={styles.reward_count}>2500₽</p>
              </div>
            </div>

            <div className={`${styles.reward} ${styles.first_place}`}>
              <img src={firstPlaceIcon} alt="First place" />
              <div className={styles.rewardAmount}>
                <RubleIcon className={styles.rubleIcon} />
                <p className={styles.reward_count}>5000₽</p>
              </div>
            </div>

            <div className={`${styles.reward} ${styles.third_place}`}>
              <img src={thirdPlaceIcon} alt="Third place" />
              <div className={styles.rewardAmount}>
                <RubleIcon
                  className={`${styles.rubleIcon} ${styles.bronzeRuble}`}
                />
                <p className={styles.reward_count}>1000₽</p>
              </div>
            </div>
          </div>

          <div className={styles.leaderboardList}>
            {leaderboard.map((user, index) => {
              // Определяем, является ли пользователь топ-3
              const isTop3 = index < 3;
              // Определяем, является ли пользователь текущим пользователем
              const isCurrentUser = user.user_id === user_info.user_id;

              return (
                <div
                  key={user.user_id}
                  className={`${styles.leaderboardItem} ${
                    isTop3 ? styles.top3 : ""
                  } ${isCurrentUser ? styles.currentUser : ""}`}
                >
                  <span className={styles.rank}>
                    #{user.leaderboard_position}
                  </span>
                  <span className={styles.name}>{user.username}</span>{" "}
                  {/* Используем username */}
                  <div className={styles.rewardAmount}>
                    {/* Рендерим RubleIcon только для топ-3 */}
                    {isTop3 && (
                      <RubleIcon
                        className={`${styles.rubleIcon} ${
                          index === 0
                            ? ""
                            : index === 1
                            ? styles.silverRuble
                            : styles.bronzeRuble
                        }`}
                      />
                    )}
                    <span className={styles.score}>
                      {user.coins_count.toLocaleString()}₽
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Отображаем текущего пользователя отдельно, если он не в топ-100 */}
            {user_info.leaderboard_position > leaderboard.length && (
              <div className={styles.currentUser}>
                <span className={styles.rank}>
                  #{user_info.leaderboard_position}
                </span>
                <span className={styles.name}>{user_info.username}</span>{" "}
                {/* Используем username */}
                <span className={styles.score}>
                  {user_info.coins_count.toLocaleString()}₽
                </span>
              </div>
            )}
          </div>

          {/* Пагинация */}
          {/*<div className={styles.pagination}>
            <button
              disabled={pagination.current_page === 1}
              onClick={handlePrevPage}
              className={styles.navButton}
            >
              Назад
            </button>
            <span>
              Страница {pagination.current_page} из {pagination.total_pages}
            </span>
            <button
              disabled={pagination.current_page === pagination.total_pages}
              onClick={handleNextPage}
              className={styles.navButton}
            >
              Вперёд
            </button>
          </div>*/}
        </main>
      </div>
    </SharedContainer>
  );
};

export default LeaderBoardPage;
