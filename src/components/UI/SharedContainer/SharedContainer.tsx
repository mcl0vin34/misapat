import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "./SharedContainer.scss";

interface SharedContainerProps {
  children: ReactNode;
}

const SharedContainer: React.FC<SharedContainerProps> = ({ children }) => {
  const location = useLocation();

  // Проверяем текущий маршрут
  const isShopRoute = location.pathname === "/shop";
  const isLeaderBoardRoute = location.pathname === "/leaderboard";

  return (
    <div className="main-page">
      <div
        style={{
          background:
            isShopRoute || isLeaderBoardRoute
              ? "#1F1F1F"
              : "linear-gradient(180deg, #2D3236 0%, #000000 100%)",
        }}
        className="container"
      >
        <div className="inner_container">{children}</div>
      </div>
    </div>
  );
};

export default SharedContainer;
