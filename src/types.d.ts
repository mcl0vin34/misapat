interface Window {
  Telegram: {
    WebApp: {
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
