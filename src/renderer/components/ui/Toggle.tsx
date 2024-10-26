import React from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked = false, onChange, disabled = false, className = '' }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked 
          ? 'bg-primary' 
          : 'bg-surface-hover border border-border'
      } ${
        disabled ? 'opacity-disabled cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-text-inverse transition-transform duration-200`}
      />
    </button>
  );
}
