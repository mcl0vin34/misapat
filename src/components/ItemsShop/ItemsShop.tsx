import React, { useEffect, useState } from "react";
import axios from "axios";
import ShopCard from "../ShopCard/ShopCard";
import useModalStore from "../../store/useModalStore";
import SharedContainer from "../UI/SharedContainer/SharedContainer";
import styles from "./ItemsShop.module.scss";
import ShopCardModalContent from "../ShopCard/ShopCardModalContent/ShopCardModalContent";
import { ShopItem } from "../../types/ShopItem";

const ItemsShop = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { openModal, modalStack } = useModalStore();

  const isModalOpen = modalStack.length > 0;
  const modalContent = modalStack[modalStack.length - 1];

  useEffect(() => {
    axios
      .get("https://dev.simatap.ru/api/market-items")
      .then((response) => setShopItems(response.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (error)
    return (
      <p style={{ color: "#fff", textAlign: "center" }}>
        Ошибка: {error.message}
      </p>
    );

  const handleCardClick = (card: ShopItem) => {
    console.log(card);

    openModal(
      <ShopCardModalContent card={card} />,
      card.backgroundColor || "#2d3236"
    );
  };

  const renderCard = (card: ShopItem, index: number, position: string) => (
    <ShopCard
      key={`${position}-card-${index}`}
      {...card}
      backgroundColor={card.backgroundColor}
      onClick={() => handleCardClick(card)}
    />
  );

  const banner = shopItems.find((item) => item.type === "banner");
  const cardsWithImage = shopItems.filter(
    (item) => item.type === "cardWithImage"
  );

  const splitCards = cardsWithImage.reduce(
    (acc, card, index) => {
      index % 2 === 0 ? acc.left.push(card) : acc.right.push(card);
      return acc;
    },
    { left: [] as ShopItem[], right: [] as ShopItem[] }
  );

  return (
    <div className={styles.itemsShop}>
      {banner && renderCard(banner, 0, "banner")}
      <div className={styles.flexContainer}>
        <div className={styles.column}>
          {splitCards.left.map((card, index) =>
            renderCard(card, index, "left")
          )}
        </div>
        <div className={styles.column}>
          {splitCards.right.map((card, index) =>
            renderCard(card, index, "right")
          )}
        </div>
      </div>
      {isModalOpen && (
        <SharedContainer>{modalContent?.content}</SharedContainer>
      )}
    </div>
  );
};

export default ItemsShop;
