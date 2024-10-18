// src/components/ShopCard/ShopCardModalWithImage.tsx
import React from "react";
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";
import styles from "./ShopCardWithImageModal.module.scss";
import { ShopItem } from "../../../types/ShopItem";
import { formatPrice } from "../../../utils/formatPrice"; // Импортируем утилиту

interface ShopCardWithImageModalProps {
  card: ShopItem;
  imageSrc: string;
}

const ShopCardWithImageModal: React.FC<ShopCardWithImageModalProps> = ({
  card,
  imageSrc,
}) => {
  const displayPrice = (price?: number): string => {
    if (price === undefined || price === null) return "";
    return formatPrice(price);
  };

  return (
    <div className={styles.modal_wrapper}>
      <div className={styles.price}>
        <CoinIcon className={styles.coinIcon} />
        <span className={styles.price}>{displayPrice(card?.price)}</span>
      </div>

      <div className={`${styles.modalContent} ${styles.withImage}`}>
        {imageSrc && (
          <img src={imageSrc} alt={card.title} className={styles.image} />
        )}

        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.detailedDescription}>{card.detailedDescription}</p>

        <p className={styles.itemCount}>Осталось {card.count} шт.</p>

        <button className={styles.buyButton}>Купить промокод</button>
      </div>
    </div>
  );
};

export default ShopCardWithImageModal;
