import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
  };
  children: ReactNode;
  className?: string;
}

export function Section({ title, badge, children, className = '' }: SectionProps) {
  const getBadgeClasses = (variant: string = 'primary') => {
    const baseClasses = 'text-xs font-normal px-2 py-0.5 rounded-full';
    const variantClasses = {
      primary: 'bg-primary-bg text-primary',
      secondary: 'bg-secondary-bg text-secondary',
      success: 'bg-success-bg text-success',
      warning: 'bg-warning-bg text-warning',
    };
    return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]}`;
  };

  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-text flex items-center gap-2">
          {title}
          {badge && <span className={getBadgeClasses(badge.variant)}>{badge.text}</span>}
        </h2>
      </div>
      {children}
    </section>
  );
}
