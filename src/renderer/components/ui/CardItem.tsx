import React, { ReactNode } from 'react';

interface CardItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CardItem({ children, className = '', onClick }: CardItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 hover:bg-surface-hover transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
