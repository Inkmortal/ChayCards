import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, className = '', action }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 rounded-lg border border-border bg-surface-hover bg-opacity-50 text-center transition-all duration-200 hover:bg-surface min-h-[140px] ${className}`}>
      <div className="w-12 h-12 text-secondary mb-2">
        {icon}
      </div>
      <p className="text-sm font-medium text-text-light">{title}</p>
      {description && (
        <p className="text-xs text-text-lighter mt-1">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
