import React from "react";
import { motion } from "framer-motion";
import "./AnimatedDigit.scss";

interface AnimatedDigitProps {
  digit: string;
}

const AnimatedDigit: React.FC<AnimatedDigitProps> = ({ digit }) => {
  return (
    <motion.span
      key={digit}
      initial={{ y: -30, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 30, opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5, // Немного увеличили длительность
      }}
      className="digit"
    >
      {digit}
    </motion.span>
  );
};

export default AnimatedDigit;
