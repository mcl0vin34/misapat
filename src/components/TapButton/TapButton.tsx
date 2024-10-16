import React, { useState, useRef, useEffect } from "react";
import TapIcons from "../TapIcons/TapIcons";
import { nanoid } from "nanoid";
import "./TapButton.scss";
import useCoinStore from "../../store/useCoinStore";
import tg from "../../utils/tg";

const MAX_ICONS = 50;

interface TapButtonProps {
  lionImage: string;
}

interface IconEffect {
  key: string;
  style: React.CSSProperties;
  type: "coin" | "heart";
}

const TapButton: React.FC<TapButtonProps> = ({ lionImage }) => {
  const { coinsPerClick, energy, addCoins } = useCoinStore();
  const [tapIcons, setTapIcons] = useState<IconEffect[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressTransform, setPressTransform] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = async (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    // Удаляем или комментируем эту строку
    // e.preventDefault();
    if (energy < coinsPerClick) {
      console.warn("Недостаточно энергии для добавления монет.");
      return;
    }

    let touchX: number;
    let touchY: number;

    if ("touches" in e && e.touches.length > 0) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      touchX = e.clientX;
      touchY = e.clientY;
    } else {
      return;
    }

    await addCoins();

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = touchX - rect.left;
      const y = touchY - rect.top;

      // Генерируем иконки
      const numIcons = 10;
      const newIcons: IconEffect[] = [];
      for (let i = 0; i < numIcons; i++) {
        const id = nanoid();
        const angle = Math.random() * 360;
        const distance = 100 + Math.random() * 50;
        const radians = (angle * Math.PI) / 180;
        const xOffset = Math.cos(radians) * distance;
        const yOffset = Math.sin(radians) * distance;

        newIcons.push({
          key: id,
          style: {
            "--move-x": `${xOffset}px`,
            "--move-y": `${yOffset}px`,
            left: `${x}px`,
            top: `${y}px`,
          } as React.CSSProperties,
          type: i % 2 === 0 ? "coin" : "heart",
        });
      }

      setTapIcons((prevIcons) => {
        const updatedIcons = [...prevIcons, ...newIcons];
        return updatedIcons.slice(-MAX_ICONS);
      });

      // Анимация нажатия
      const offsetX = (x / rect.width - 0.5) * 20;
      const offsetY = (y / rect.height - 0.5) * 20;

      setPressTransform({ x: offsetX, y: offsetY });
      setIsPressed(true);
    }

    // Добавляем вибрацию (если нужно)
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && (tg as any)?.HapticFeedback) {
      (tg as any).HapticFeedback.impactOccurred("medium");
    } else if (!isProduction && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleInteractionEnd = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    // Удаляем или комментируем эту строку
    // e.preventDefault();
    setIsPressed(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTapIcons([]);
    }, 700);

    return () => clearTimeout(timeout);
  }, [tapIcons]);

  return (
    <div
      className={`button-wrapper ${isPressed ? "pressed" : ""}`}
      ref={wrapperRef}
      style={{
        transform: isPressed
          ? `translate(${pressTransform.x}px, ${pressTransform.y}px) scale(0.95)`
          : "translate(0, 0) scale(1)",
      }}
    >
      <div className="button-border"></div>
      <button
        className="lion-button"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        disabled={energy < coinsPerClick}
      >
        <img src={lionImage} alt="Lion" className="lion-image" />
        <TapIcons tapIcons={tapIcons} />
      </button>
    </div>
  );
};

export default TapButton;
