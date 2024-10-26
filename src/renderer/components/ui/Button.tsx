import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({ 
  variant = 'secondary', 
  icon, 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 gap-2 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-text-inverse shadow-sm hover:shadow focus:ring-2 focus:ring-primary focus:ring-opacity-20',
    secondary: 'bg-surface hover:bg-surface-hover active:bg-surface-active border border-border text-text-dark shadow-sm hover:shadow focus:ring-2 focus:ring-secondary focus:ring-opacity-20',
  };

  const disabledClasses = disabled ? 'opacity-disabled cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={variant === 'secondary' ? 'text-text-light' : ''}>{icon}</span>}
      {children}
    </button>
  );
}
