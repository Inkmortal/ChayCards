import { Folder } from '../../../core/storage/folders/models';

export interface Item {
  id: string;
  name: string;
  type: 'folder';
  modifiedAt: string;
  createdAt: string;
}

// Base props for all folder views
export interface BaseFolderViewProps {
  items: Item[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateFolder: () => void;
  onMove: (sourceId: string, targetId: string | null) => void;
  onRename: (id: string, newName: string) => void;
  folders?: Folder[];
  currentFolderId?: string | null;
  itemToRename: Item | null;
  setItemToRename: (item: Item | null) => void;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
}

// Specific view props can extend base props if needed
export interface CardViewProps extends BaseFolderViewProps {}
export interface SimpleViewProps extends BaseFolderViewProps {}
export interface TreeViewProps extends BaseFolderViewProps {}
