// src/pages/ShopPage/ShopPage.tsx

import React, { useState } from "react";
import styles from "./ShopPage.module.scss";
import ItemsShop from "../../components/ItemsShop/ItemsShop";
import LevelingShop from "../../components/BoostersShop/BoostersShop";

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState<"items" | "leveling">("items");

  const handleTabChange = (tab: "items" | "leveling") => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.shopPage}>
      <h1 className={styles.shop_title}>Магазин</h1>
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "items" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("items")}
        >
          Товары и скидки
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "leveling" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("leveling")}
        >
          Бустеры
        </button>
      </div>

      <div className={styles.scrollContainer}>
        <div className={styles.tabContent}>
          {activeTab === "items" && <ItemsShop />}
          {activeTab === "leveling" && <LevelingShop />}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
