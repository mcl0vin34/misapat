import React, { useState, useEffect, useRef } from "react";
import coinIcon from "../../assets/icons/coin.svg"; // Путь к иконке монеты
import { nanoid } from "nanoid"; // Для генерации уникальных ID
import "./TapButton.scss"; // Подключаем стили для этого компонента

interface TapButtonProps {
  onIncrement: () => void;
  lionImage: string; // Путь к изображению льва
}

const TapButton: React.FC<TapButtonProps> = ({ onIncrement, lionImage }) => {
  const [tapEffects, setTapEffects] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [coinAmountEffect, setCoinAmountEffect] = useState<
    { id: string; x: number; y: number; amount: number }[]
  >([]); // Для отображения монет
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
    const touchX = e.clientX;
    const touchY = e.clientY;

    onIncrement();

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = touchX - rect.left; // Относительное положение внутри кнопки
      const y = touchY - rect.top;

      // Добавляем новый текст монет
      const newText = { id: nanoid(), x, y, amount: 1 };
      setCoinAmountEffect((prevTexts) => [...prevTexts, newText]);

      // Генерируем множество монет
      const numCoins = 10; // Уменьшили количество монет до 10
      const newCoins = Array.from({ length: numCoins }).map(() => {
        const id = nanoid();
        const angle = Math.random() * 360; // Случайный угол в градусах
        const distance = 100 + Math.random() * 50; // Случайное расстояние от 100 до 150 пикселей
        const radians = (angle * Math.PI) / 180;
        const xOffset = Math.cos(radians) * distance;
        const yOffset = Math.sin(radians) * distance;

        return { id, x: xOffset, y: yOffset };
      });

      setTapEffects((prevEffects) => [...prevEffects, ...newCoins]);

      // Определяем направление клика и применяем соответствующий сдвиг
      const offsetX = (x / rect.width - 0.5) * 20; // Максимальный сдвиг 10px в каждую сторону
      const offsetY = (y / rect.height - 0.5) * 20;

      setPressTransform({ x: offsetX, y: offsetY });
      setIsPressed(true);
    }
  };

  const handleInteractionEnd = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    // Удаляем старые эффекты через 1 секунду
    const timeout = setTimeout(() => {
      setTapEffects([]);
      setCoinAmountEffect([]); // Убираем отображение монет
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
      >
        <img src={lionImage} alt="Lion" className="lion-image" />
        {/* Эффекты разлетающихся монет */}
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
        {/* Отображение количества полученных монет */}
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
