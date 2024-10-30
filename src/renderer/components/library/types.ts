import { Folder, FolderItem } from '../../../core/storage/folders/models';
import { MoveFolderResult } from '../../../core/operations/types';
import { FolderConflict } from '../../../core/operations/folders/conflicts';

// Drag and Drop State
export interface DragState {
  draggedItem: string | null;
  dragOverItem: string | null;
}

// Common conflict resolution handlers
export interface ConflictResolvers {
  replace: () => void;
  rename: () => void;
  cancel: () => void;
}

// Base view props shared across all folder views
export interface FolderViewProps {
  // Data
  items: FolderItem[];
  folders?: Folder[];
  currentFolderId?: string | null;

  // Operations
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateFolder: () => void;
  onMove: (sourceId: string, targetId: string | null) => Promise<MoveFolderResult>;
  onRename: (id: string, newName: string) => void;

  // State
  itemToRename: FolderItem | null;
  setItemToRename: (item: FolderItem | null) => void;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
  
  // Optional props
  onConflictResolve?: ConflictResolvers;
  folderConflict?: FolderConflict | null;
}

// Tree specific props
export interface TreeViewProps {
  items: Folder[];  // Tree uses core Folder type for hierarchy
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRename?: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMove?: (sourceId: string, targetId: string | null) => Promise<MoveFolderResult>;
  folderConflict?: FolderConflict | null;
  onConflictResolve?: ConflictResolvers;
  itemToRename: FolderItem | null;
  setItemToRename: (item: FolderItem | null) => void;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
  level?: number;
}

// View-specific props
export interface CardViewProps extends FolderViewProps {}
export interface SimpleViewProps extends FolderViewProps {}
