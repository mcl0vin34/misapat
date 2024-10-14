// src/components/AnimatedNumber/AnimatedNumber.tsx
import React from "react";
import { AnimatePresence } from "framer-motion";
import AnimatedDigit from "../AnimatedDigit/AnimatedDigit";
import "./AnimatedNumber.scss";

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const digits = value.toString().split("");

  return (
    <div className="animated-number">
      <AnimatePresence initial={false}>
        {digits.map((digit, index) => (
          <AnimatedDigit key={index} digit={digit} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedNumber;
