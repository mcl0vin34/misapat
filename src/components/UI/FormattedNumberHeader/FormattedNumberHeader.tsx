import React from "react";
import "./FormattedNumberHeader.scss";
import { ReactComponent as CoinIcon } from "../../../assets/icons/coin.svg";

interface FormattedNumberHeaderProps {
  number: number;
}

const FormattedNumberHeader: React.FC<FormattedNumberHeaderProps> = ({
  number,
}) => {
  // Форматируем число с пробелами каждые три цифры
  const formattedNumber = number
    .toLocaleString("ru-RU")
    .replace(/\u00A0/g, " "); // Заменяем неразрывный пробел на обычный

  return (
    <div className="formatted-number">
      <CoinIcon className="coin_icon" />
      <span className="number">{formattedNumber}</span>
    </div>
  );
};

export default FormattedNumberHeader;
