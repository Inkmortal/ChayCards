import React, { useState, DragEvent, MouseEvent } from 'react';
import { Icon } from '../Icon';
import { RenameModal } from '../../library/RenameModal';
import { useContextMenu } from '../../../contexts/ContextMenuContext';
import { TreeNodeProps } from './types';

export function TreeNode({ 
  item, 
  items, 
  level, 
  selectedId, 
  onSelect, 
  onCreateFolder, 
  onRename, 
  onMove 
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
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
          onClick: () => setShowRenameModal(true)
        }
      ], { x: e.clientX, y: e.clientY });
    }
  };

  return (
    <>
      <div
        className={`group flex items-center py-1.5 px-2 text-sm rounded-md cursor-pointer transition-all duration-150 ${
          selectedId === item.id 
            ? 'bg-primary/10 text-primary font-medium shadow-sm' 
            : 'hover:bg-surface-hover text-text-dark hover:text-text'
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
          className={`flex-shrink-0 w-4 h-4 mr-2 transition-colors ${
            selectedId === item.id 
              ? 'text-primary' 
              : 'text-text-lighter group-hover:text-text-light'
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
              className={`ml-1 w-4 h-4 flex items-center justify-center transition-all duration-150 ${
                isExpanded ? 'transform rotate-90' : ''
              } ${
                selectedId === item.id 
                  ? 'text-primary' 
                  : 'text-text-lighter group-hover:text-text-light'
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
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-active rounded-md transition-all ml-2"
          title="Create subfolder"
        >
          <Icon name="plus" className="w-3.5 h-3.5 text-text-lighter group-hover:text-primary" />
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div className="transition-all duration-150">
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
            />
          ))}
        </div>
      )}
      {showRenameModal && onRename && (
        <RenameModal
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          onRename={(newName) => {
            onRename(item.id, newName);
            setShowRenameModal(false);
          }}
          currentName={item.name}
        />
      )}
    </>
  );
}
