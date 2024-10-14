// src/components/AnimatedDigit/AnimatedDigit.tsx
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="digit"
    >
      {digit}
    </motion.span>
  );
};

export default AnimatedDigit;
