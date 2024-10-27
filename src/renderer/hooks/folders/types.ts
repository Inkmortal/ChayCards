export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
}

export interface FolderConflict {
  sourceId: string;
  targetId: string | null;
  sourceName: string;
}

export interface FolderData {
  folders: Folder[];
  version: number;
  lastBackup: string;
}

export interface FolderState {
  folders: Folder[];
  currentFolderId: string | null;
  isCreateModalOpen: boolean;
  newFolderName: string;
  folderError?: string;
  createInFolderId: string | null;
  isLoading: boolean;
  folderConflict: FolderConflict | null;
}

export interface MoveAfterRename {
  targetId: string | null;
}
