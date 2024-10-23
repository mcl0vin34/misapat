// src/utils/vibrate.ts

const vibrate = (pattern: number | number[]) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Проверяем наличие объекта `tg` и его свойств для вибрации (например, Telegram)
  if (isProduction && (window as any)?.tg?.HapticFeedback) {
    (window as any).tg.HapticFeedback.impactOccurred("medium");
  } else if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export default vibrate;
