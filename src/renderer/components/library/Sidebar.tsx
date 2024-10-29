import React, { useState } from 'react';
import { Icon, TreeView } from '../ui';
import { Folder } from '../../../core/storage/folders/models';
import { FolderConflict } from '../../../core/operations/folders/conflicts';
import { Item } from './types';

interface SidebarProps {
  folders: Folder[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateFolder: (parentId: string | null) => void;
  onMoveFolder?: (sourceId: string, targetId: string | null) => void;
  onRenameFolder?: (id: string, newName: string) => void;
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

export function Sidebar({ 
  folders, 
  selectedId, 
  onSelect, 
  onCreateFolder, 
  onMoveFolder,
  onRenameFolder,
  folderConflict,
  onConflictResolve,
  itemToRename,
  setItemToRename,
  pendingMove,
  setPendingMove
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      className={`border-r border-border bg-surface/50 flex flex-col transition-all duration-200 ease-in-out ${
        isExpanded ? 'w-72' : 'w-10'
      }`}
    >
      {isExpanded ? (
        <>
          <div className="flex items-center justify-between p-2">
            <h2 className="font-medium text-sm text-text flex items-center gap-2">
              <Icon name="folder" className="w-4 h-4 text-primary" />
              Folders
            </h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 text-text-lighter hover:text-text rounded-md hover:bg-surface-hover transition-colors"
              title="Collapse sidebar"
            >
              <Icon name="chevron-left" className="w-4 h-4" />
            </button>
          </div>
          <div className="px-2 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search folders..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-surface border border-border rounded-md placeholder-text-lighter focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
              />
              <Icon
                name="document"
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-lighter"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <TreeView
              items={folders}
              selectedId={selectedId}
              onSelect={onSelect}
              onCreateFolder={onCreateFolder}
              onMove={onMoveFolder}
              onRename={onRenameFolder}
              folderConflict={folderConflict}
              onConflictResolve={onConflictResolve}
              itemToRename={itemToRename}
              setItemToRename={setItemToRename}
              pendingMove={pendingMove}
              setPendingMove={setPendingMove}
            />
          </div>
        </>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-10 flex items-center justify-center text-text-lighter hover:text-text hover:bg-surface-hover transition-colors"
          title="Expand sidebar"
        >
          <Icon name="chevron-right" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
