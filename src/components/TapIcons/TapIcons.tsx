// components/TapIcons/TapIcons.tsx
import React, { useMemo } from "react";
import coinIcon from "../../assets/icons/coin.svg";
import heartIcon from "../../assets/icons/heart.svg";
import "./TapIcons.scss";

interface IconEffect {
  key: string;
  style: React.CSSProperties;
  type: "coin" | "heart";
}

interface TapIconsProps {
  tapIcons: IconEffect[];
  removeIcons?: () => void; // Сделали необязательным
}

const TapIcons: React.FC<TapIconsProps> = ({ tapIcons, removeIcons }) => {
  const memoizedTapIcons = useMemo(() => tapIcons, [tapIcons]);

  return (
    <>
      {memoizedTapIcons.map((icon) => (
        <div
          key={icon.key}
          className="icon"
          style={icon.style}
          onAnimationEnd={removeIcons}
        >
          {icon.type === "coin" ? (
            <img src={coinIcon} alt="Coin" />
          ) : (
            <img src={heartIcon} alt="Heart" />
          )}
        </div>
      ))}
    </>
  );
};

export default TapIcons;
