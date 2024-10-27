import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Position {
  x: number;
  y: number;
}

interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: Position;
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Adjust position if menu would go off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newPosition = { ...position };

      if (position.x + rect.width > window.innerWidth) {
        newPosition.x = window.innerWidth - rect.width;
      }
      if (position.y + rect.height > window.innerHeight) {
        newPosition.y = window.innerHeight - rect.height;
      }

      setAdjustedPosition(newPosition);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [position, onClose]);

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[160px] py-1 bg-surface shadow-lg rounded-md border border-border"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className="w-full px-4 py-2 text-sm text-text-dark hover:bg-surface-hover flex items-center gap-2 transition-colors"
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.icon && <span className="text-text-light">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );

  // Create portal to render at root level
  return createPortal(menu, document.body);
}
