import React from 'react';
import { SimpleView } from './SimpleView';
import { CardView } from './CardView';
import { ViewToggle } from '../ui/ViewToggle';
import { Folder } from '../../../core/storage/folders/models';
import { FolderConflict } from '../../../core/operations/folders/conflicts';
import { Item } from './types';

interface FolderGridProps {
  folders: Folder[];
  currentFolder: Folder | null;
  allFolders?: Folder[];
  onCreateFolder: () => void;
  onNavigateFolder: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMoveFolder: (sourceId: string, targetId: string | null) => void;
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

export function FolderGrid({
  folders,
  currentFolder,
  allFolders = [],
  onCreateFolder,
  onNavigateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMoveFolder,
  folderConflict,
  onConflictResolve,
  itemToRename,
  setItemToRename,
  pendingMove,
  setPendingMove
}: FolderGridProps) {
  const [view, setView] = React.useState<'card' | 'simple'>('card');

  const ViewComponent = view === 'card' ? CardView : SimpleView;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle 
          view={view}
          onChange={setView}
        />
      </div>

      <ViewComponent
        items={folders.map(folder => ({
          id: folder.id,
          name: folder.name,
          type: 'folder' as const,
          modifiedAt: folder.modifiedAt,
          createdAt: folder.createdAt
        }))}
        onSelect={onNavigateFolder}
        onDelete={onDeleteFolder}
        onCreateFolder={onCreateFolder}
        onRename={onRenameFolder}
        onMove={onMoveFolder}
        folders={allFolders}
        currentFolderId={currentFolder?.id || null}
        folderConflict={folderConflict}
        onConflictResolve={onConflictResolve}
        itemToRename={itemToRename}
        setItemToRename={setItemToRename}
        pendingMove={pendingMove}
        setPendingMove={setPendingMove}
      />
    </div>
  );
}
