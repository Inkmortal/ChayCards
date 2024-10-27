import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ContextMenu } from '../components/ui';

interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface MenuPosition {
  x: number;
  y: number;
}

interface ContextMenuContextType {
  showContextMenu: (items: ContextMenuItem[], position: MenuPosition) => void;
  hideContextMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
}

interface ContextMenuProviderProps {
  children: ReactNode;
}

export function ContextMenuProvider({ children }: ContextMenuProviderProps) {
  const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([]);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const showContextMenu = (items: ContextMenuItem[], position: MenuPosition) => {
    setMenuItems(items);
    setMenuPosition(position);
  };

  const hideContextMenu = () => {
    setMenuPosition(null);
    setMenuItems([]);
  };

  return (
    <ContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
      {children}
      {menuPosition && (
        <ContextMenu
          items={menuItems}
          position={menuPosition}
          onClose={hideContextMenu}
        />
      )}
    </ContextMenuContext.Provider>
  );
}
