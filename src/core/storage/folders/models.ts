/**
 * Represents a folder in the system
 */
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
}

/**
 * Represents the persistent storage structure for folders
 */
export interface FolderData {
  folders: Folder[];
  version: number;
  lastBackup: string;
}
