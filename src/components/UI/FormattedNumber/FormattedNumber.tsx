// src/components/FormattedNumber/FormattedNumber.tsx

import React from "react";
import { motion } from "framer-motion";
import "./FormattedNumber.scss";

interface FormattedNumberProps {
  number: number;
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({ number }) => {
  // Форматируем число с пробелами каждые три цифры
  const formattedNumber = number
    .toLocaleString("ru-RU")
    .replace(/\u00A0/g, " "); // Заменяем неразрывный пробел на обычный

  return (
    <div className="formatted-number">
      {formattedNumber.split("").map((char, index) => {
        if (char === " ") {
          return (
            <span key={index} className="space">
              {" "}
            </span>
          );
        }
        return (
          <span key={index} className="digit">
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default FormattedNumber;
