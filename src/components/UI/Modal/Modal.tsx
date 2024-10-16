import React, { useEffect, useRef, useState } from "react";
import "./Modal.scss";
import closeIcon from "../../../assets/icons/close.svg";
import useModalStore from "../../../store/useModalStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const { modalBackgroundColor } = useModalStore();

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

      setTimeout(() => {
        setAnimate(true);
      }, 10);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setAnimate(false);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    if (modalRef.current) {
      setIsAtTop(modalRef.current.scrollTop === 0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isAtTop) return;
    if (startYRef.current !== null) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startYRef.current;
      if (deltaY > 50) {
        handleClose();
      }
    }
  };

  const handleTouchEnd = () => {
    startYRef.current = null;
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`modal-overlay ${isClosing ? "fade-out" : "fade-in"}`}
      ref={overlayRef}
    >
      <div
        className={`modal-content ${
          isClosing ? "slide-down" : animate ? "slide-up" : ""
        }`}
        ref={modalRef}
        style={{
          background: modalBackgroundColor || "#2d3236",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={closeIcon}
          alt="Close"
          className="close-icon"
          onClick={handleClose}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
