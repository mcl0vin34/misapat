// src/components/LoadingScreen.tsx

import React from "react";
import styles from "./LoadingScreen.module.scss";
import photoUrl from "../../../assets/images/loading.png";

interface LoadingScreenProps {
  title?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = "Добро пожаловать",
}) => {
  return (
    <div className={styles.loadingScreen}>
      <h1 className={styles.loadingScreenTitle}>{title}</h1>
      <img
        src={photoUrl}
        alt="Loading Background"
        className={styles.loadingScreenBackground}
      />
      <div className={styles.loadingScreenProgressBar}></div>
    </div>
  );
};

export default LoadingScreen;
