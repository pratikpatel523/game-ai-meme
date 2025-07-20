
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-lg mx-4 border border-accent/30">
        <div className="flex justify-between items-center p-4 border-b border-accent/20">
          <h2 className="text-xl font-bold text-highlight">{title}</h2>
          <button
            onClick={onClose}
            className="text-light hover:text-highlight transition-colors text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
