import React from 'react';
import { SimpleView } from './SimpleView';
import { CardView } from './CardView';
import { ViewToggle } from '../ui/ViewToggle';
import { Folder } from '../../../core/storage/folders/models';
import { FolderConflict } from '../../../core/operations/folders/conflicts';
import { Item } from './types';
import { FolderConflictModal } from './FolderConflictModal';
import { RenameModal } from './RenameModal';

interface FolderGridProps {
  folders: Folder[];
  currentFolder: Folder | null;
  allFolders?: Folder[];
  onCreateFolder: () => void;
  onNavigateFolder: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMoveFolder: (sourceId: string, targetId: string | null) => Promise<{
    success: boolean;
    error?: string;
    conflict?: FolderConflict;
  }>;
  onReplaceFolder: (sourceId: string, targetId: string | null) => Promise<{
    success: boolean;
    error?: string;
  }>;
  // Rename state
  itemToRename: Item | null;
  setItemToRename: (item: Item | null) => void;
  pendingMove: { sourceId: string; targetId: string | null } | null;
  setPendingMove: (move: { sourceId: string; targetId: string | null } | null) => void;
  folderConflict: FolderConflict | null;
  onConflictResolve: {
    replace: () => void;
    rename: () => void;
    cancel: () => void;
  };
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
  onReplaceFolder,
  // Rename state
  itemToRename,
  setItemToRename,
  pendingMove,
  setPendingMove,
  folderConflict,
  onConflictResolve
}: FolderGridProps) {
  const [view, setView] = React.useState<'card' | 'simple'>('card');

  // Handle move with conflict detection
  const handleMove = async (sourceId: string, targetId: string | null) => {
    const result = await onMoveFolder(sourceId, targetId);
    return result;
  };

  // Handle rename with move support
  const handleRename = (id: string, newName: string) => {
    if (pendingMove) {
      onRenameFolder(id, newName, { targetId: pendingMove.targetId });
      setPendingMove(null);
    } else {
      onRenameFolder(id, newName);
    }
    setItemToRename(null);
  };

  // Common props for views
  const viewProps = {
    items: folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      type: 'folder' as const,
      modifiedAt: folder.modifiedAt,
      createdAt: folder.createdAt
    })),
    onSelect: onNavigateFolder,
    onDelete: onDeleteFolder,
    onCreateFolder,
    onMove: handleMove,
    onRename: handleRename,
    folders: allFolders,
    currentFolderId: currentFolder?.id || null,
    itemToRename,
    setItemToRename,
    pendingMove,
    setPendingMove
  };

  const ViewComponent = view === 'card' ? CardView : SimpleView;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle 
          view={view}
          onChange={setView}
        />
      </div>

      <ViewComponent {...viewProps} />

      <FolderConflictModal
        isOpen={folderConflict !== null}
        onClose={onConflictResolve.cancel}
        onReplace={onConflictResolve.replace}
        onRename={onConflictResolve.rename}
        folderName={folderConflict?.originalName || ''}
      />

      <RenameModal
        isOpen={itemToRename !== null}
        onClose={() => setItemToRename(null)}
        onRename={(newName) => itemToRename && handleRename(itemToRename.id, newName)}
        currentName={itemToRename?.name || ''}
        folders={allFolders}
        parentId={pendingMove ? pendingMove.targetId : currentFolder?.id || null}
        itemId={itemToRename?.id}
      />
    </div>
  );
}
