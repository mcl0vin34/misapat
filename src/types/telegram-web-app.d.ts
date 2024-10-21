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
    openTelegramLink?: (url: string) => void;
    disableVerticalSwipes: () => void;
    isVerticalSwipesEnabled: boolean;
    web_app_setup_swipe_behavior?: (options: {
      allow_vertical_swipe: boolean;
    }) => void; // Добавляем метод
  }

  interface Telegram {
    WebApp: TelegramWebApp;
  }

  interface Window {
    Telegram?: Telegram;
  }
}
