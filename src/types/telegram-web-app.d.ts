// src/telegram-web-app.d.ts

interface HapticFeedback {
  impactOccurred(style: "light" | "medium" | "heavy"): void;
  notificationOccurred(type: "error" | "success" | "warning"): void;
  selectionChanged(): void;
}

interface MainButton {
  text: string;
  show(): void;
  hide(): void;
  setText(text: string): void;
  onClick(callback: () => void): void;
}

interface TelegramWebApp {
  initDataUnsafe: any;
  expand(): void;
  close(): void;
  MainButton: MainButton;
  HapticFeedback?: HapticFeedback;
}

interface Telegram {
  WebApp: TelegramWebApp;
}

interface Window {
  Telegram?: Telegram;
}
