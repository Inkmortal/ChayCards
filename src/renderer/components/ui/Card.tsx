import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  divided?: boolean;
}

export function Card({ children, className = '', onClick, divided }: CardProps) {
  return (
    <div 
      className={`bg-surface rounded-lg shadow-sm ${divided ? 'divide-y divide-border' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
