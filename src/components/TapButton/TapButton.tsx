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

interface FloatingTextEffect {
  key: string;
  style: React.CSSProperties;
  text: string;
}

const TapButton: React.FC<TapButtonProps> = ({ lionImage }) => {
  const { coinsPerClick, energy, addCoins } = useCoinStore();
  const [tapIcons, setTapIcons] = useState<IconEffect[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextEffect[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressTransform, setPressTransform] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = async (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (energy < coinsPerClick) {
      console.warn("Недостаточно энергии для добавления монет.");
      return;
    }

    const touchX = e.clientX;
    const touchY = e.clientY;

    await addCoins(); // Вызов добавления монет через WebSocket

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

      // Добавляем эффект "+13"
      const textId = nanoid();
      setFloatingTexts((prevTexts) => [
        ...prevTexts,
        {
          key: textId,
          style: {
            left: `${x}px`,
            top: `${y}px`,
          },
          text: "+13",
        },
      ]);

      setTapIcons((prevIcons) => {
        const updatedIcons = [...prevIcons, ...newIcons];
        return updatedIcons.slice(-MAX_ICONS);
      });

      const offsetX = (x / rect.width - 0.5) * 20;
      const offsetY = (y / rect.height - 0.5) * 20;

      setPressTransform({ x: offsetX, y: offsetY });
      setIsPressed(true);
    }

    // Вибрация (если необходимо)
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction && (tg as any)?.HapticFeedback) {
      (tg as any).HapticFeedback.impactOccurred("medium");
    } else if (!isProduction && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleInteractionEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPressed(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTapIcons([]);
      setFloatingTexts([]);
    }, 700);

    return () => clearTimeout(timeout);
  }, [tapIcons, floatingTexts]);

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
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onPointerCancel={handleInteractionEnd}
        disabled={energy < coinsPerClick}
      >
        <img src={lionImage} alt="Lion" className="lion-image" />
        <TapIcons tapIcons={tapIcons} />
        {floatingTexts.map(({ key, style, text }) => (
          <div key={key} className="floating-text" style={style}>
            {text}
          </div>
        ))}
      </button>
    </div>
  );
};

export default TapButton;
