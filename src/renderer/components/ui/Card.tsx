import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  divided?: boolean;
}

export function Card({ children, className = '', divided = false }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-surface ${divided ? 'divide-y divide-border' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface CardItemProps {
  children: ReactNode;
  className?: string;
}

export function CardItem({ children, className = '' }: CardItemProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
