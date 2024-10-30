import React, { useState, DragEvent, MouseEvent } from 'react';
import { Icon } from '../Icon';
import { RenameModal } from '../../library/RenameModal';
import { useContextMenu } from '../../../contexts/ContextMenuContext';
import { TreeViewProps } from '../../library/types';
import { Folder } from '../../../../core/storage/folders/models';

interface TreeNodeProps extends TreeViewProps {
  item: Folder;
  level: number;
}

export function TreeNode({ 
  item, 
  items, 
  level, 
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
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const { showContextMenu } = useContextMenu();
  const children = items.filter(i => i.parentId === item.id);
  const hasChildren = children.length > 0;

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId !== item.id && onMove) {
      onMove(sourceId, item.id);
    }
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRename) {
      showContextMenu([
        {
          label: 'Rename',
          icon: '✏️',
          onClick: () => setItemToRename({
            ...item,
            type: 'folder'
          })
        }
      ], { x: e.clientX, y: e.clientY });
    }
  };

  const handleRename = (newName: string) => {
    if (onRename) {
      if (pendingMove) {
        onRename(item.id, newName, { targetId: pendingMove.targetId });
        setPendingMove(null);
      } else {
        onRename(item.id, newName);
      }
      setItemToRename(null);
    }
  };

  return (
    <>
      <div
        className={`group flex items-center py-1.5 px-2 text-sm rounded-md cursor-pointer transition-all duration-300 ${
          selectedId === item.id 
            ? 'bg-primary-bg text-primary font-medium' 
            : 'hover:bg-surface text-text hover:text-secondary'
        } ${isDragOver ? 'ring-2 ring-secondary/50 bg-secondary/5' : ''}`}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={() => onSelect(item.id)}
        onContextMenu={handleContextMenu}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        <Icon 
          name="folder"
          className={`flex-shrink-0 w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110 ${
            selectedId === item.id 
              ? 'text-primary' 
              : 'text-primary group-hover:text-secondary'
          }`} 
        />
        <div className="flex items-center min-w-0 flex-1">
          <span className="truncate">{item.name}</span>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`ml-1 w-4 h-4 flex items-center justify-center transition-all duration-300 ${
                isExpanded ? 'transform rotate-90' : ''
              } ${
                selectedId === item.id 
                  ? 'text-primary' 
                  : 'text-text-light group-hover:text-secondary'
              }`}
            >
              <Icon 
                name="chevron-right" 
                className="w-3.5 h-3.5"
              />
            </button>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateFolder(item.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-hover rounded-md transition-all duration-300 ml-2"
          title="Create subfolder"
        >
          <Icon name="plus" className="w-3.5 h-3.5 text-text-light hover:text-secondary" />
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div className="transition-all duration-300">
          {children.map(child => (
            <TreeNode
              key={child.id}
              item={child}
              items={items}
              level={level + 1}
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
      )}
    </>
  );
}
