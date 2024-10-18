// src/components/ShopCard/ShopCardModalContent.tsx
import React from "react";
import styles from "./ShopCardModalContent.module.scss";
import { ShopItem } from "../../../types/ShopItem";
import ShopCardWithImageModal from "./ShopCardWithImageModal/ShopCardWithImageModal";
import ShopCardModalBanner from "./ShopCardModalBanner/ShopCardModalBanner";

interface ShopCardModalContentProps {
  card: ShopItem;
}

const ShopCardModalContent: React.FC<ShopCardModalContentProps> = ({
  card,
}) => {
  // Определяем путь к изображению, если оно есть
  let imageSrc = "";
  if (card.image) {
    try {
      imageSrc = require(`../../../assets/images/${card.image}`);
    } catch (error) {
      console.error(`Изображение не найдено: ${card.image}`);
      // Установите изображение по умолчанию, если требуется
    }
  }

  // Условный рендеринг компонентов модалки
  if (card.type === "cardWithImage") {
    return <ShopCardWithImageModal card={card} imageSrc={imageSrc} />;
  } else if (card.type === "banner") {
    return <ShopCardModalBanner card={card} imageSrc={imageSrc} />;
  } else {
    // Обработка неизвестных типов, если необходимо
    return (
      <div className={styles.modal_wrapper}>
        <div className={styles.modalContent}>
          <h3 className={styles.title}>{card.title}</h3>
          <p className={styles.detailedDescription}>
            {card.detailedDescription}
          </p>
          <button className={styles.buyButton}>Купить промокод</button>
        </div>
      </div>
    );
  }
};

export default ShopCardModalContent;
