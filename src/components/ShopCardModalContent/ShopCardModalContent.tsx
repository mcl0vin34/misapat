// src/components/ShopCard/ShopCardModalContent.tsx
import React from "react";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import styles from "./ShopCardModalContent.module.scss";
import { ShopItem } from "../../types/ShopItem";

interface ShopCardModalContentProps {
  card: ShopItem;
}

const ShopCardModalContent: React.FC<ShopCardModalContentProps> = ({
  card,
}) => {
  const modalClassName =
    card.type === "cardWithoutImage" ? styles.cardWithoutImage : styles.default;

  // Используем require для динамической загрузки изображения
  let imageSrc;

  console.log(card);
  if (card.image) {
    try {
      imageSrc = require(`../../assets/images/${card.image}`);
    } catch (error) {
      console.error(`Изображение не найдено: ${card.image}`);
      imageSrc = ""; // Можно установить изображение по умолчанию
    }
  }

  return (
    <div className={styles.modal_wrapper}>
      <div className={styles.price}>
        <CoinIcon className={styles.coinIcon} />
        <span className={styles.price}>{card.price?.toLocaleString()}</span>
      </div>

      <div className={`${styles.modalContent} ${modalClassName}`}>
        {imageSrc && (
          <img src={imageSrc} alt={card.title} className={styles.image} />
        )}

        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.detailedDescription}>{card.detailedDescription}</p>

        <p className={styles.itemCount}>Осталось {card.count} шт.</p>
        {/*
        <p className={styles.detailedMiniDescription}>
          {card.detailedMiniDescription}
        </p>*/}

        <button className={styles.buyButton}>Приобрести</button>
      </div>
    </div>
  );
};

export default ShopCardModalContent;
