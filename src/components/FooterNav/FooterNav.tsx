// src/components/FooterNav/FooterNav.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as FriendsIcon } from "../../assets/icons/friends.svg";
import { ReactComponent as TaskListIcon } from "../../assets/icons/task-list.svg";
import { ReactComponent as LeaderboardIcon } from "../../assets/icons/leaderboard.svg";
import { ReactComponent as SimaShopIcon } from "../../assets/icons/coin.svg";
import "./FooterNav.scss";

const FooterNav = () => {
  return (
    <nav className="footer">
      <ul className="footer_menu">
        <li className="footer_menu__item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Главная"
          >
            <HomeIcon className="nav-icon" />
            <span className="nav-label">Главная</span>
          </NavLink>
        </li>
        <li className="footer_menu__item">
          <NavLink
            to="/friendslist"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Уровень"
          >
            <FriendsIcon className="nav-icon" />
            <span className="nav-label">Друзья</span>
          </NavLink>
        </li>
        <li className="footer_menu__item">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "active_shop_link" : " shop_link"
            }
            aria-label="Магазин"
          >
            <SimaShopIcon className="nav-icon shop-icon" />
            <span className="nav-label">Магазин</span>
          </NavLink>
        </li>
        <li className="footer_menu__item">
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? "active leaderboard__link" : "leaderboard__link"
            }
            aria-label="Лидеры"
          >
            <LeaderboardIcon className="nav-icon leaderboard-icon" />
            <span className="nav-label">Лидеры</span>
          </NavLink>
        </li>
        <li className="footer_menu__item">
          <NavLink
            to="/quests"
            className={({ isActive }) => (isActive ? "active" : "")}
            aria-label="Задания"
          >
            <TaskListIcon className="nav-icon" />
            <span className="nav-label">Задания</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default FooterNav;
