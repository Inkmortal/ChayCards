import React from 'react';
import { SimpleView } from './SimpleView';
import { CardView } from './CardView';
import { ViewToggle } from '../ui/ViewToggle';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
}

interface FolderGridProps {
  folders: Folder[];
  currentFolder: Folder | null;
  onCreateFolder: () => void;
  onNavigateFolder: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string, moveAfter?: { targetId: string | null }) => void;
  onMoveFolder: (sourceId: string, targetId: string | null) => void;
}

export function FolderGrid({
  folders,
  currentFolder,
  onCreateFolder,
  onNavigateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMoveFolder
}: FolderGridProps) {
  const [view, setView] = React.useState<'card' | 'simple'>('card');

  const ViewComponent = view === 'card' ? CardView : SimpleView;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle 
          view={view}
          onChange={setView}
        />
      </div>

      <ViewComponent
        items={folders.map(folder => ({
          id: folder.id,
          name: folder.name,
          type: 'folder' as const,
          modifiedAt: folder.modifiedAt,
          createdAt: folder.createdAt
        }))}
        onSelect={onNavigateFolder}
        onDelete={onDeleteFolder}
        onCreateFolder={onCreateFolder}
        onRename={onRenameFolder}
        onMove={onMoveFolder}
      />
    </div>
  );
}
