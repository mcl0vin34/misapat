// src/components/ShopCard/ShopCardModalContent.tsx
import React from "react";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import styles from "./ShopCardModalContent.module.scss";
import { ShopItem } from "../../types/ShopItem";
import imageMap from "../../assets/imageMap";

interface ShopCardModalContentProps {
  card: ShopItem;
}

const ShopCardModalContent: React.FC<ShopCardModalContentProps> = ({
  card,
}) => {
  const modalClassName =
    card.type === "cardWithoutImage" ? styles.cardWithoutImage : styles.default;

  console.log(card);

  return (
    <div className={styles.modal_wrapper}>
      <div className={styles.price}>
        <CoinIcon className={styles.coinIcon} />
        <span className={styles.price}>{card.price?.toLocaleString()}</span>
      </div>

      <div className={`${styles.modalContent} ${modalClassName}`}>
        {card.image && (
          <img
            src={imageMap[card.image]} // Достаем путь из imageMap
            alt={card.title}
            className={styles.image}
          />
        )}

        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.detailedDescription}>{card.detailedDescription}</p>
        <p className={styles.detailedMiniDescription}>
          {card.detailedMiniDescription}
        </p>
      </div>
    </div>
  );
};

export default ShopCardModalContent;
