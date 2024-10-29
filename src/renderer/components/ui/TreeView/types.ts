import { Folder } from '../../../../core/storage/folders/models';
import { FolderConflict } from '../../../../core/operations/folders/conflicts';
import { Item } from '../../../components/library/types';

export interface TreeViewProps {
  items: Folder[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRename?: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMove?: (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => void;
  folderConflict?: FolderConflict | null;
  onConflictResolve?: {
    replace: () => void;
    rename: () => void;
    cancel: () => void;
  };
  itemToRename: Item | null;
  setItemToRename: (item: Item | null) => void;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
}

export interface TreeNodeProps extends Omit<TreeViewProps, 'items'> {
  item: Folder;
  items: Folder[];
  level: number;
}
