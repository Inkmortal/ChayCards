import React, { useState } from 'react';
import { EmptyState, Button, Icon } from '../ui';
import { RenameModal } from './RenameModal';
import { FolderConflictModal } from './FolderConflictModal';
import { ListItem } from './ListItem';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { Item } from './types';

interface SimpleViewProps {
  items: Item[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateFolder: () => void;
  onRename: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMove?: (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => void;
}

export function SimpleView({ items = [], onSelect, onDelete, onCreateFolder, onRename, onMove }: SimpleViewProps) {
  const [itemToRename, setItemToRename] = useState<Item | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    sourceId: string;
    targetId: string | null;
  } | null>(null);
  
  const {
    dragState,
    folderConflict,
    setFolderConflict,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleConflictReplace
  } = useDragAndDrop({ 
    items, 
    onMove
  });

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
          name: folderConflict.sourceName
        });
      }
    }
    setFolderConflict(null);
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

  const handleCloseRename = () => {
    setItemToRename(null);
    setPendingMove(null);
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
        onClose={handleCloseRename}
        onRename={handleRename}
        currentName={itemToRename?.name || ''}
      />

      <FolderConflictModal
        isOpen={folderConflict !== null}
        onClose={() => setFolderConflict(null)}
        onReplace={handleConflictReplace}
        onRename={handleConflictRename}
        folderName={folderConflict?.sourceName || ''}
      />
    </>
  );
}
