import React from "react";
import "./FormattedNumber.scss";

interface FormattedNumberProps {
  number: number;
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({ number }) => {
  // Форматируем число с пробелами каждые три цифры
  const formattedNumber = number
    .toLocaleString("ru-RU")
    .replace(/\u00A0/g, " "); // Заменяем неразрывный пробел на обычный

  // Разбиваем на группы по три цифры
  const numberGroups = formattedNumber.split(" ");

  return (
    <div className="formatted-number">
      {numberGroups.map((group, index) => (
        <React.Fragment key={index}>
          <span className="number-group">{group}</span>
          {index < numberGroups.length - 1 && <span className="space" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FormattedNumber;
