// src/components/UI/Modal/Modal.tsx

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";
import closeIcon from "../../../assets/icons/close.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string; // Новый проп для фона
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  backgroundColor,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setAnimate(false);

      const handleClickOutside = (event: MouseEvent) => {
        if (overlayRef.current && event.target === overlayRef.current) {
          handleClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      // Запускаем анимацию после небольшой задержки
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 10);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setAnimate(false);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Время анимации закрытия
  };

  if (!isOpen && !isClosing) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${isClosing ? "fade-out" : "fade-in"}`}
      ref={overlayRef}
      style={{ background: backgroundColor || "rgba(0, 0, 0, 0.5)" }} // Применяем цвет фона
    >
      <div
        className={`modal-content ${
          isClosing ? "slide-down" : animate ? "slide-up" : ""
        }`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие клика
      >
        <img
          src={closeIcon}
          alt="Close"
          className="close-icon"
          onClick={handleClose}
        />
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
