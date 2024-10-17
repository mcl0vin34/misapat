// src/types/telegram-web-app.d.ts

export {};

declare global {
  interface TelegramWebApp {
    initDataUnsafe: any;
    expand: () => void;
    close: () => void;
    MainButton: {
      text: string;
      show: () => void;
      onClick: (callback: () => void) => void;
    };
    openTelegramLink?: (url: string) => void; // Ensure this line is present
  }

  interface Telegram {
    WebApp: TelegramWebApp;
  }

  interface Window {
    Telegram?: Telegram;
  }
}
