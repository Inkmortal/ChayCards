import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';
import { EmptyState } from './EmptyState';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface FolderViewProps {
  folders: Folder[];
  currentFolderId: string | null;
  onCreateFolder: () => void;
  onDeleteFolder: (id: string) => void;
  onNavigateFolder: (id: string) => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  folders,
  currentFolderId,
  onCreateFolder,
  onDeleteFolder,
  onNavigateFolder,
}) => {
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Folders</h2>
        <Button onClick={onCreateFolder}>
          <Icon name="plus" className="mr-2" />
          New Folder
        </Button>
      </div>

      {currentFolders.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No folders"
          description="Create a new folder to organize your cards"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentFolders.map((folder) => (
            <Card
              key={folder.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onNavigateFolder(folder.id)}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="folder" className="text-text-light" />
                  <span className="text-text">{folder.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="text-text-light hover:text-error transition-colors"
                >
                  <Icon name="trash" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
