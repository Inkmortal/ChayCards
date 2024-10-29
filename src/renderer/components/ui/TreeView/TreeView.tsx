import React, { DragEvent } from 'react';
import { Icon } from '../Icon';
import { TreeNode } from './TreeNode';
import { TreeViewProps } from './types';
import { FolderConflictModal } from '../../library/FolderConflictModal';

export function TreeView({ 
  items, 
  selectedId, 
  onSelect, 
  onCreateFolder, 
  onRename, 
  onMove,
  folderConflict,
  onConflictResolve,
  itemToRename,
  setItemToRename,
  pendingMove,
  setPendingMove
}: TreeViewProps) {
  const rootItems = items.filter(item => item.parentId === null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const sourceId = e.dataTransfer.getData('text/plain');
    if (onMove) {
      onMove(sourceId, null);
    }
  };

  const handleConflictRename = () => {
    if (folderConflict) {
      const sourceItem = items.find(item => item.id === folderConflict.sourceId);
      if (sourceItem) {
        setPendingMove({
          sourceId: folderConflict.sourceId,
          targetId: folderConflict.targetId
        });
        setItemToRename({
          id: sourceItem.id,
          name: folderConflict.suggestedName,
          type: 'folder',
          modifiedAt: sourceItem.modifiedAt,
          createdAt: sourceItem.createdAt
        });
      }
    }
    onConflictResolve?.rename?.();
  };

  return (
    <>
      <div className="text-text-dark">
        <div
          className={`flex items-center py-1.5 px-2 text-sm rounded-md cursor-pointer group transition-all duration-150 mb-1 ${
            selectedId === null 
              ? 'bg-primary/10 text-primary font-medium shadow-sm' 
              : 'hover:bg-surface-hover text-text-dark hover:text-text'
          } ${isDragOver ? 'ring-2 ring-secondary/50 bg-secondary/5' : ''}`}
          onClick={() => onSelect(null)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon 
            name="folder"
            className={`flex-shrink-0 w-4 h-4 mr-2 ${
              selectedId === null 
                ? 'text-primary' 
                : 'text-text-lighter group-hover:text-text-light'
            }`} 
          />
          <span className="truncate flex-1">Library</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateFolder(null);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-active rounded-md transition-all ml-2"
            title="Create folder"
          >
            <Icon name="plus" className="w-3.5 h-3.5 text-text-lighter group-hover:text-primary" />
          </button>
        </div>
        {rootItems.map(item => (
          <TreeNode
            key={item.id}
            item={item}
            items={items}
            level={1}
            selectedId={selectedId}
            onSelect={onSelect}
            onCreateFolder={onCreateFolder}
            onRename={onRename}
            onMove={onMove}
            folderConflict={folderConflict}
            onConflictResolve={onConflictResolve}
            itemToRename={itemToRename}
            setItemToRename={setItemToRename}
            pendingMove={pendingMove}
            setPendingMove={setPendingMove}
          />
        ))}
      </div>

      {folderConflict && onConflictResolve && (
        <FolderConflictModal
          isOpen={true}
          onClose={onConflictResolve.cancel}
          onReplace={onConflictResolve.replace}
          onRename={handleConflictRename}
          folderName={folderConflict.originalName}
        />
      )}
    </>
  );
}
