import React from 'react';
import { Icon } from './Icon';

interface ViewToggleProps {
  view: 'card' | 'simple';
  onChange: (view: 'card' | 'simple') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-surface rounded-lg p-0.5 border border-border">
      <button
        onClick={() => onChange('card')}
        className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${
          view === 'card'
            ? 'bg-background text-text-dark shadow-sm'
            : 'text-text-light hover:text-text-dark'
        }`}
      >
        <Icon name="document" className="w-4 h-4" />
        Cards
      </button>
      <button
        onClick={() => onChange('simple')}
        className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${
          view === 'simple'
            ? 'bg-background text-text-dark shadow-sm'
            : 'text-text-light hover:text-text-dark'
        }`}
      >
        <Icon name="document" className="w-4 h-4" />
        Simple
      </button>
    </div>
  );
}
