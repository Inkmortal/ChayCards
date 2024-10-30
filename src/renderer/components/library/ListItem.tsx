import React, { DragEvent } from 'react';
import { Icon } from '../ui';
import { DragState } from './types';
import { FolderItem } from '../../../core/storage/folders/models';
import { formatDate } from './base/BaseFolderView';

interface ListItemProps {
  item: FolderItem;
  dragState: DragState;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onStartRename: (item: FolderItem) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>, id: string | null) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, id: string | null) => void;
  onDragEnd: () => void;
}

export function ListItem({
  item,
  dragState,
  onSelect,
  onDelete,
  onStartRename,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}: ListItemProps) {
  const { draggedItem, dragOverItem } = dragState;

  return (
    <div
      className={`group grid grid-cols-[1fr,200px,100px] gap-4 px-4 py-3 hover:bg-surface transition-colors cursor-pointer relative
        ${dragOverItem === item.id ? 'bg-secondary/10 ring-2 ring-secondary/50' : ''}
        ${draggedItem === item.id ? 'opacity-50' : ''}`}
      onClick={() => onSelect(item.id)}
      draggable={item.type === 'folder'}
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver(e, item.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, item.id)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-3">
        <Icon
          name={item.type === 'folder' ? 'folder' : 'document'}
          className={`w-5 h-5 ${
            item.type === 'folder' ? 'text-primary' : 'text-text-light'
          }`}
        />
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-text truncate group-hover:text-secondary transition-colors">
            {item.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartRename(item);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-hover rounded-md transition-all"
            title="Rename folder"
          >
            <Icon name="pencil" className="w-4 h-4 text-text-light hover:text-secondary transition-colors" />
          </button>
        </div>
      </div>
      <div className="text-text-light text-sm group-hover:text-secondary-light transition-colors">
        {formatDate(item.modifiedAt)}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-1.5 hover:bg-surface-hover rounded-md transition-colors"
          title="Delete folder"
        >
          <Icon name="trash" className="w-4 h-4 text-text-light hover:text-error transition-colors" />
        </button>
      </div>
      {/* Drop indicator */}
      {dragOverItem === item.id && draggedItem !== item.id && (
        <div className="absolute inset-0 border-2 border-secondary/50 rounded-md pointer-events-none">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-secondary/20 text-secondary font-medium px-2 py-1 rounded shadow-sm text-sm">
            Move into folder
          </div>
        </div>
      )}
    </div>
  );
}
