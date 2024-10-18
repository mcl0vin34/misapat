// src/utils/formatPrice.ts

export const formatPrice = (price: number): string => {
  if (price >= 1_000_000_000_000) {
    return `${Math.floor(price / 1_000_000_000_000)}T`;
  } else if (price >= 1_000_000_000) {
    return `${Math.floor(price / 1_000_000_000)}B`;
  } else if (price >= 1_000_000) {
    return `${Math.floor(price / 1_000_000)}M`;
  } else if (price >= 1_000) {
    return `${Math.floor(price / 1_000)}K`;
  } else {
    return price.toString();
  }
};
