// src/components/ShopCard/ShopCard.tsx
import React from "react";
import styles from "./ShopCard.module.scss";
import { ReactComponent as CoinIcon } from "../../assets/icons/coin.svg";
import { formatPrice } from "../../utils/formatPrice"; // Импортируем утилиту

interface ShopCardProps {
  id: number;
  type: "banner" | "cardWithImage" | "cardWithoutImage";
  image?: string;
  title?: string;
  description: string;
  miniDescription?: string;
  detailedDescription?: string;
  detailedMiniDescription?: string;
  price?: number;
  discountPercentage?: number;
  category?: string;
  backgroundColor?: string;
  onClick: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  id,
  type,
  image,
  title,
  miniDescription,
  detailedDescription,
  detailedMiniDescription,
  price,
  discountPercentage,
  category,
  backgroundColor,
  description,
  onClick,
}) => {
  const cardClassName =
    type === "cardWithImage"
      ? `${styles.cardWithImage} ${styles[`card_${id}`]}`
      : styles.cardWithImage;

  // Функция для форматирования цены
  const displayPrice = (price?: number): string => {
    if (price === undefined || price === null) return "";
    return formatPrice(price);
  };

  return (
    <div
      className={`${styles.shopCard} ${
        type === "banner"
          ? styles.banner
          : type === "cardWithImage"
          ? cardClassName
          : styles.cardWithoutImage
      }`}
      style={
        type === "cardWithImage" && backgroundColor
          ? { background: backgroundColor }
          : undefined
      }
      onClick={onClick}
    >
      {type === "banner" && (
        <div
          className={styles.bannerContent}
          style={{
            backgroundImage: `url(${require(`../../assets/images/${image}`)})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className={styles.bannerTextContainer}>
            <h3 className={styles.bannerTitle}>{title}</h3>
            <p className={styles.bannerMiniDescription}>{miniDescription}</p>

            <div className={styles.bannerPriceContainer}>
              <CoinIcon className={styles.coinIcon} />
              <p className={styles.bannerPrice}>{displayPrice(price)}</p>
            </div>
          </div>
        </div>
      )}
      {type === "cardWithImage" && (
        <div className={`${styles.card_with_image_wrapper}`}>
          {image && (
            <img
              src={require(`../../assets/images/${image}`)}
              alt={title}
              className={styles.cardImage}
            />
          )}
          <h3 className={styles.title}>{title}</h3>
          {/*<p className={styles.miniDescription}>{miniDescription}</p>*/}

          <div className={styles.divider}></div>

          <p className={styles.miniDescription}>{description}</p>

          <div className={styles.priceContainer}>
            <CoinIcon className={styles.coinIcon} />
            <p className={styles.price}>{displayPrice(price)}</p>
          </div>
        </div>
      )}
      {type === "cardWithoutImage" && (
        <div
          className={`${styles.discountContainer} ${styles.card_without_image_wrapper}`}
        >
          <h2 className={styles.discount}>-{discountPercentage}%</h2>
          <p className={styles.category}>{category}</p>
          <div className={styles.priceContainer}>
            <CoinIcon className={styles.coinIcon} />
            <p className={styles.price}>{displayPrice(price)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCard;
