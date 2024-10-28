import React, { DragEvent, useState, useEffect } from 'react';
import { Icon } from '../ui';
import { RenameModal } from './RenameModal';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface FolderContextProps {
  currentFolder: Folder;
  breadcrumbPath: Folder[];
  onNavigateBack: () => void;
  onNavigateToFolder: (id: string | null) => void;
  onMoveFolder?: (sourceId: string, targetId: string | null) => void;
  onRenameFolder?: (id: string, newName: string) => Promise<boolean>;
}

export function FolderContext({ 
  currentFolder,
  breadcrumbPath,
  onNavigateBack,
  onNavigateToFolder,
  onMoveFolder,
  onRenameFolder
}: FolderContextProps) {
  const [showFullPath, setShowFullPath] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [breadcrumbDragOverId, setBreadcrumbDragOverId] = useState<string | null>(null);
  const [isDraggingOverBreadcrumb, setIsDraggingOverBreadcrumb] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDraggingOverBreadcrumb(false);
      setBreadcrumbDragOverId(null);
    };

    const handleGlobalDragOver = (e: globalThis.DragEvent) => {
      if (!e.target || !(e.target as HTMLElement).closest('.breadcrumb-item')) {
        setBreadcrumbDragOverId(null);
      }
    };

    document.addEventListener('dragend', handleGlobalDragEnd);
    document.addEventListener('dragover', handleGlobalDragOver);

    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
      document.removeEventListener('dragover', handleGlobalDragOver);
    };
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>, id: string | null) => {
    e.preventDefault();
    if (!isDraggingOverBreadcrumb) {
      setIsDraggingOverBreadcrumb(true);
    }
    setBreadcrumbDragOverId(id);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setBreadcrumbDragOverId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string | null) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (onMoveFolder && sourceId && sourceId !== targetId) {
      onMoveFolder(sourceId, targetId);
    }
    setBreadcrumbDragOverId(null);
    setIsDraggingOverBreadcrumb(false);
  };

  const handleRename = async (newName: string) => {
    if (onRenameFolder) {
      const success = await onRenameFolder(currentFolder.id, newName);
      if (success) {
        setShowRenameModal(false);
      }
    }
  };

  const renderPathItems = () => {
    const items = [
      <div
        key="library"
        onDragOver={(e) => handleDragOver(e, null)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, null)}
        onClick={() => onNavigateToFolder(null)}
        className={`text-text-light hover:text-secondary transition-colors px-2 py-1 rounded-md whitespace-nowrap cursor-pointer breadcrumb-item
          ${isDraggingOverBreadcrumb && breadcrumbDragOverId === null ? 'bg-secondary/10 ring-1 ring-secondary/30' : ''}`}
      >
        Library
      </div>
    ];

    const visibleCount = 3;
    const pathToShow = showFullPath 
      ? breadcrumbPath 
      : breadcrumbPath.length > visibleCount 
        ? breadcrumbPath.slice(-visibleCount) 
        : breadcrumbPath;
    
    if (!showFullPath && breadcrumbPath.length > visibleCount) {
      items.push(
        <div
          key="ellipsis"
          onClick={() => setShowFullPath(true)}
          className="text-text-lighter hover:text-secondary px-2 cursor-pointer"
          title={`Show full path (${breadcrumbPath.length - visibleCount} more folders)`}
        >
          ...
        </div>
      );
    }

    pathToShow.forEach((folder, index) => {
      const isLast = index === pathToShow.length - 1;
      items.push(
        <span key={`separator-${folder.id}`} className="text-text-lighter">/</span>
      );
      items.push(
        <div
          key={folder.id}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder.id)}
          onClick={() => onNavigateToFolder(folder.id)}
          onMouseEnter={() => isLast && setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer breadcrumb-item
            ${isLast 
              ? 'text-secondary font-medium' 
              : 'text-text-light hover:text-secondary hover:bg-surface/80'}
            ${isDraggingOverBreadcrumb && breadcrumbDragOverId === folder.id ? 'bg-secondary/10 ring-1 ring-secondary/30' : ''}`}
        >
          <span>{folder.name}</span>
          {isLast && isHovering && !isDraggingOverBreadcrumb && onRenameFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameModal(true);
              }}
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-surface/80"
            >
              <Icon name="pencil" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      );
    });

    return items;
  };

  return (
    <div className="bg-surface-hover rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={onNavigateBack}
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md bg-surface hover:bg-surface-hover border border-border text-text-light hover:text-text-dark transition-colors"
        >
          <Icon name="chevron-left" className="w-5 h-5" />
        </button>
        <div 
          className="flex items-center gap-2 text-lg overflow-x-auto no-scrollbar"
          onMouseEnter={() => isOverflowing && setShowFullPath(true)}
          onMouseLeave={() => setShowFullPath(false)}
        >
          {renderPathItems()}
        </div>
      </div>

      {showRenameModal && (
        <RenameModal
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          onRename={handleRename}
          currentName={currentFolder.name}
          folders={breadcrumbPath}
          parentId={currentFolder.parentId}
          itemId={currentFolder.id}
        />
      )}
    </div>
  );
}
