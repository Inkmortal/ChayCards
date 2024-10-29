import React from 'react';
import { Icon, EmptyState, Button } from '../ui';
import { RenameModal } from './RenameModal';
import { FolderConflictModal } from './FolderConflictModal';
import { ListItem } from './ListItem';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { Item } from './types';
import { Folder } from '../../../core/storage/folders/models';
import { FolderConflict } from '../../../core/operations/folders/conflicts';

interface SimpleViewProps {
  items: Item[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateFolder: () => void;
  onRename: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMove?: (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => void;
  folders?: Folder[];
  currentFolderId?: string | null;
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

export function SimpleView({ 
  items = [], 
  onSelect, 
  onDelete, 
  onCreateFolder, 
  onRename, 
  onMove,
  folders = [],
  currentFolderId = null,
  folderConflict = null,
  onConflictResolve,
  itemToRename,
  setItemToRename,
  pendingMove,
  setPendingMove
}: SimpleViewProps) {
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop({ onMove });

  if (items.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<Icon name="folder" className="w-full h-full" />}
          title="No folders yet"
          description="Create a new folder to get started"
          action={
            <Button onClick={onCreateFolder}>
              Create Folder
            </Button>
          }
        />
      </div>
    );
  }

  const handleConflictRename = () => {
    if (folderConflict) {
      const sourceItem = items.find(item => item.id === folderConflict.sourceId);
      if (sourceItem) {
        setPendingMove({
          sourceId: folderConflict.sourceId,
          targetId: folderConflict.targetId
        });
        setItemToRename({
          ...sourceItem,
          name: folderConflict.suggestedName
        });
      }
    }
    onConflictResolve?.rename?.();
  };

  const handleRename = (newName: string) => {
    if (!itemToRename) return;

    if (pendingMove) {
      onRename(itemToRename.id, newName, { targetId: pendingMove.targetId });
      setPendingMove(null);
    } else {
      onRename(itemToRename.id, newName);
    }
    setItemToRename(null);
  };

  return (
    <>
      <div 
        className="w-full overflow-hidden"
        onDragOver={(e) => handleDragOver(e, null)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, null)}
      >
        <div className="grid grid-cols-[1fr,200px,100px] gap-4 px-4 py-2 text-sm text-text-light border-b border-border">
          <div>Name</div>
          <div>Modified</div>
          <div>Actions</div>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              dragState={dragState}
              onSelect={onSelect}
              onDelete={onDelete}
              onStartRename={setItemToRename}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>

      <RenameModal
        isOpen={itemToRename !== null}
        onClose={() => setItemToRename(null)}
        onRename={handleRename}
        currentName={itemToRename?.name || ''}
        folders={folders}
        parentId={pendingMove ? pendingMove.targetId : currentFolderId}
        itemId={itemToRename?.id}
      />

      <FolderConflictModal
        isOpen={folderConflict !== null}
        onClose={() => onConflictResolve?.cancel?.()}
        onReplace={() => onConflictResolve?.replace?.()}
        onRename={handleConflictRename}
        folderName={folderConflict?.originalName || ''}
      />
    </>
  );
}
