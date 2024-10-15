import React from "react";
import { motion } from "framer-motion";
import "./AnimatedDigit.scss";

interface AnimatedDigitProps {
  digit: string;
}

const AnimatedDigit: React.FC<AnimatedDigitProps> = ({ digit }) => {
  return (
    <span key={digit} className="digit">
      {digit}
    </span>
  );
};

export default AnimatedDigit;
