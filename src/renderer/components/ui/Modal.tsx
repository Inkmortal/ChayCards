import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-background bg-opacity-75" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-lg font-semibold text-text mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
