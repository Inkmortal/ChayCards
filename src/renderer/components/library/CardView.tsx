import React, { useState } from 'react';
import { Icon, EmptyState, Button } from '../ui';
import { RenameModal } from './RenameModal';
import { FolderConflictModal } from './FolderConflictModal';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { Item } from './types';

interface CardViewProps {
  items: Item[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateFolder: () => void;
  onRename: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMove?: (sourceId: string, targetId: string | null, skipConflictCheck?: boolean) => void;
  folders?: { id: string; name: string; parentId: string | null; }[];
  currentFolderId?: string | null;
}

export function CardView({ 
  items = [], 
  onSelect, 
  onDelete, 
  onCreateFolder, 
  onRename, 
  onMove,
  folders = [],
  currentFolderId = null
}: CardViewProps) {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }

      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
        return 'Today';
      } else if (diffInDays === 1) {
        return 'Yesterday';
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else {
        return date.toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
      return 'Unknown';
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

  return (
    <>
      <style>
        {`
          @keyframes folder-shake {
            0%, 100% { transform: scale(1.02) rotate(0deg); }
            25% { transform: scale(1.02) rotate(-1deg); }
            75% { transform: scale(1.02) rotate(1deg); }
          }
          @keyframes folder-glow {
            0%, 100% { box-shadow: 0 0 10px var(--chay-primary-light); }
            50% { box-shadow: 0 0 20px var(--chay-primary); }
          }
          .folder-receiving {
            animation: folder-shake 0.5s ease-in-out infinite, folder-glow 1.5s ease-in-out infinite;
          }
          .card-hover-rise {
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
          }
          .card-hover-rise:hover {
            transform: translateY(-2px);
            box-shadow: var(--chay-primary-light) 0px 2px 8px -2px;
          }
        `}
      </style>
      <div 
        className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 p-4"
        onDragOver={(e) => handleDragOver(e, null)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, null)}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-surface hover:bg-surface rounded-lg border border-border card-hover-rise transition-colors duration-300 cursor-pointer h-40
              ${dragState.dragOverItem === item.id ? 'ring-2 ring-secondary/50 bg-secondary/10 folder-receiving' : ''}
              ${dragState.draggedItem === item.id ? 'opacity-50' : ''}`}
            onClick={() => onSelect(item.id)}
            draggable={item.type === 'folder'}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex h-full">
              <div className="w-40 flex items-center justify-center">
                {item.type === 'folder' ? (
                  <Icon name="folder" className="w-16 h-16 text-primary transition-transform duration-300 group-hover:scale-110" />
                ) : (
                  <Icon name="document" className="w-16 h-16 text-text-lighter transition-colors duration-300" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center pr-12">
                <div>
                  <h3 
                    className="text-2xl font-medium text-text group-hover:text-secondary truncate transition-colors duration-300" 
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-text-light group-hover:text-secondary-light transition-colors duration-300 mt-2">
                    Modified {formatDate(item.modifiedAt)}
                  </p>
                </div>
              </div>
              <div 
                className="absolute top-3 right-3 flex items-center gap-1"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setItemToRename(item)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-hover rounded-md transition-all duration-300 z-10"
                  title="Rename folder"
                >
                  <Icon name="pencil" className="w-4 h-4 text-text-light hover:text-secondary transition-colors duration-300" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-hover rounded-md transition-all duration-300 z-10"
                  title="Delete folder"
                >
                  <Icon name="trash" className="w-4 h-4 text-text-light hover:text-error transition-colors duration-300" />
                </button>
              </div>
              {/* Drop indicator */}
              {dragState.dragOverItem === item.id && dragState.draggedItem !== item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-secondary/20 text-secondary font-medium px-2 py-1 rounded shadow-sm text-sm z-20">
                  Move into folder
                </div>
              )}
            </div>
          </div>
        ))}
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
        onClose={() => setFolderConflict(null)}
        onReplace={handleConflictReplace}
        onRename={handleConflictRename}
        folderName={folderConflict?.sourceName || ''}
      />
    </>
  );
}
