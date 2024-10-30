import React from 'react';
import { Icon, EmptyState, Button } from '../../ui';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { FolderViewProps } from '../types';

interface RenderProps {
  dragState: ReturnType<typeof useDragAndDrop>['dragState'];
  dragHandlers: {
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>, id: string | null) => void;
    handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, id: string | null) => void;
    handleDragEnd: () => void;
  };
  containerProps: {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  };
}

export interface BaseFolderViewProps extends FolderViewProps {
  renderContent: (props: RenderProps) => React.ReactNode;
}

export function BaseFolderView({ 
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
  setPendingMove,
  renderContent
}: BaseFolderViewProps) {
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop({ onMove });

  const header = (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold text-text">Folders</span>
      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary-bg text-secondary">{items.length}</span>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        {header}
        <EmptyState
          icon={
            <svg className="w-full h-full text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          title="No folders yet"
          description="Create a new folder to get started"
          action={
            <Button
              variant="primary"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }
              onClick={onCreateFolder}
            >
              Create Folder
            </Button>
          }
        />
      </div>
    );
  }

  const dragHandlers = {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };

  const containerProps = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, null),
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent<HTMLDivElement>) => handleDrop(e, null)
  };

  return (
    <div className="space-y-4">
      {header}
      {renderContent({
        dragState,
        dragHandlers,
        containerProps
      })}
    </div>
  );
}

// Utility function for date formatting (shared between views)
export function formatDate(dateString: string): string {
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
}
