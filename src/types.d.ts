interface Window {
  Telegram: {
    WebApp: {
      initDataUnsafe: any;
      expand: () => void;
      close: () => void;
      MainButton: {
        text: string;
        show: () => void;
        onClick: (callback: () => void) => void;
      };
    };
  };
}
