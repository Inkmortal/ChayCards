import React from 'react';
import { Icon, EmptyState, Button } from '../ui';
import { ListItem } from './ListItem';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { SimpleViewProps } from './types';

export function SimpleView({ 
  items = [], 
  onSelect, 
  onDelete, 
  onCreateFolder, 
  onMove,
  onRename,
  folders = [],
  currentFolderId = null,
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

  return (
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
  );
}
