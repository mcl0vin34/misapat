// src/components/ItemsShop/ItemsShop.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ShopCard from "../ShopCard/ShopCard";
import useModalStore from "../../store/useModalStore";
import SharedContainer from "../UI/SharedContainer/SharedContainer";
import styles from "./ItemsShop.module.scss";
import ShopCardModalContent from "../ShopCardModalContent/ShopCardModalContent";
import { ShopItem } from "../../types/ShopItem"; // Импортируем тип

const ItemsShop = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { openModal, isModalOpen, modalContent } = useModalStore();

  useEffect(() => {
    axios
      .get("https://a4429e27fbaa3135.mokky.dev/shop-items")
      .then((response) => {
        setShopItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error.message}</p>;
  }

  const handleCardClick = (card: ShopItem) => {
    openModal(
      <ShopCardModalContent card={card} />,
      card.backgroundColor || "#2d3236"
    );
  };

  const banner = shopItems.find((item) => item.type === "banner");
  const cardsWithImage = shopItems.filter(
    (item) => item.type === "cardWithImage"
  );
  const cardsWithoutImage = shopItems.filter(
    (item) => item.type === "cardWithoutImage"
  );

  const leftColumn = [
    cardsWithImage[0],
    cardsWithoutImage[0],
    cardsWithImage[1],
  ];

  const rightColumn = [
    cardsWithoutImage[1],
    cardsWithImage[2],
    cardsWithImage[3],
  ];

  return (
    <div className={styles.itemsShop}>
      {/* Отображаем баннер */}
      {banner && (
        <ShopCard
          key="banner"
          id={banner.id}
          type={banner.type}
          image={banner.image}
          title={banner.title}
          miniDescription={banner.miniDescription}
          detailedDescription={banner.detailedDescription}
          detailedMiniDescription={banner.detailedMiniDescription}
          price={banner.price}
          discountPercentage={banner.discountPercentage}
          category={banner.category}
          onClick={() => handleCardClick(banner)}
        />
      )}

      <div className={styles.flexContainer}>
        {/* Левый столбец */}
        <div className={styles.column}>
          {leftColumn.map(
            (card, index) =>
              card && (
                <ShopCard
                  key={`left-card-${index}`}
                  id={card.id}
                  type={card.type}
                  image={card.image}
                  title={card.title}
                  miniDescription={card.miniDescription}
                  detailedDescription={card.detailedDescription}
                  detailedMiniDescription={card.detailedMiniDescription}
                  price={card.price}
                  discountPercentage={card.discountPercentage}
                  category={card.category}
                  backgroundColor={card.backgroundColor}
                  onClick={() => handleCardClick(card)}
                />
              )
          )}
        </div>

        {/* Правый столбец */}
        <div className={styles.column}>
          {rightColumn.map(
            (card, index) =>
              card && (
                <ShopCard
                  key={`right-card-${index}`}
                  id={card.id}
                  type={card.type}
                  image={card.image}
                  title={card.title}
                  miniDescription={card.miniDescription}
                  detailedDescription={card.detailedDescription}
                  detailedMiniDescription={card.detailedMiniDescription}
                  price={card.price}
                  discountPercentage={card.discountPercentage}
                  category={card.category}
                  backgroundColor={card.backgroundColor}
                  onClick={() => handleCardClick(card)}
                />
              )
          )}
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && <SharedContainer>{modalContent}</SharedContainer>}
    </div>
  );
};

export default ItemsShop;