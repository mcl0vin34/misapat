// src/components/ShopCard/ShopCardModalBanner.tsx
import React from "react";
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";
import styles from "./ShopCardModalBanner.module.scss";
import { ShopItem } from "../../../types/ShopItem";
import { formatPrice } from "../../../utils/formatPrice"; // Импортируем утилиту

interface ShopCardModalBannerProps {
  card: ShopItem;
  imageSrc: string;
}

const ShopCardModalBanner: React.FC<ShopCardModalBannerProps> = ({
  card,
  imageSrc,
}) => {
  // Функция для форматирования цены
  const displayPrice = (price?: number): string => {
    if (price === undefined || price === null) return "";
    return formatPrice(price);
  };

  return (
    <div className={styles.modal_wrapper}>
      <div className={styles.price}>
        <CoinIcon className={styles.coinIcon} />
        <span className={styles.price}>{displayPrice(card.price)}</span>
      </div>

      <div className={`${styles.modalContent} ${styles.banner}`}>
        {imageSrc && (
          <img src={imageSrc} alt={card.title} className={styles.image} />
        )}

        <div className={styles.bannerTextContainer}>
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.detailedDescription}>
            {card.detailedDescription}
          </p>

          {/*<p className={styles.itemCount}>Осталось {card.count} шт.</p>*/}

          <button className={styles.buyButton}>Купить купон</button>
        </div>
      </div>
    </div>
  );
};

export default ShopCardModalBanner;
