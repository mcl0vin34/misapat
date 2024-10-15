import React, { useState, useEffect, useRef } from "react";
import coinIcon from "../../assets/icons/coin.svg";
import { nanoid } from "nanoid";
import "./TapButton.scss";
import useCoinStore from "../../store/useCoinStore"; // Импортируем стор

interface TapButtonProps {
  onIncrement: () => void;
  lionImage: string;
}

const TapButton: React.FC<TapButtonProps> = ({ onIncrement, lionImage }) => {
  const { coinsPerClick, energy } = useCoinStore(); // Получаем количество монет за клик и энергию из стора
  const [tapEffects, setTapEffects] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [coinAmountEffect, setCoinAmountEffect] = useState<
    { id: string; x: number; y: number; amount: number }[]
  >([]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressTransform, setPressTransform] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Проверяем, достаточно ли энергии
    if (energy < coinsPerClick) {
      return; // Если энергии недостаточно, выходим из функции
    }

    const touchX = e.clientX;
    const touchY = e.clientY;

    onIncrement(); // Вызываем функцию увеличения монет

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = touchX - rect.left;
      const y = touchY - rect.top;

      // Используем текущее количество монет за клик из стора
      const newText = { id: nanoid(), x, y, amount: coinsPerClick };
      setCoinAmountEffect((prevTexts) => [...prevTexts, newText]);

      const numCoins = 10;
      const newCoins = Array.from({ length: numCoins }).map(() => {
        const id = nanoid();
        const angle = Math.random() * 360;
        const distance = 100 + Math.random() * 50;
        const radians = (angle * Math.PI) / 180;
        const xOffset = Math.cos(radians) * distance;
        const yOffset = Math.sin(radians) * distance;

        return { id, x: xOffset, y: yOffset };
      });

      setTapEffects((prevEffects) => [...prevEffects, ...newCoins]);

      const offsetX = (x / rect.width - 0.5) * 20;
      const offsetY = (y / rect.height - 0.5) * 20;

      setPressTransform({ x: offsetX, y: offsetY });
      setIsPressed(true);
    }
  };

  const handleInteractionEnd = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTapEffects([]);
      setCoinAmountEffect([]);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [tapEffects, coinAmountEffect]);

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
        disabled={energy < coinsPerClick} // Блокируем кнопку при недостатке энергии
      >
        <img src={lionImage} alt="Lion" className="lion-image" />
        <div className="coin-animation">
          {tapEffects.map((effect) => (
            <img
              key={effect.id}
              src={coinIcon}
              alt="Coin"
              className="coin"
              style={
                {
                  "--x": `${effect.x}px`,
                  "--y": `${effect.y}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        {coinAmountEffect.map((effect) => (
          <div
            key={effect.id}
            className="coin-amount-effect"
            style={{
              left: `${effect.x}px`,
              top: `${effect.y}px`,
            }}
          >
            +{effect.amount}
          </div>
        ))}
      </button>
    </div>
  );
};

export default TapButton;
