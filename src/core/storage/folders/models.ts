// Base model for all folder-related entities
export interface FolderBase {
  id: string;
  name: string;
  modifiedAt: string;
  createdAt: string;
}

// Core folder model
export interface Folder extends FolderBase {
  parentId: string | null;
}

// UI representation of a folder
export interface FolderItem extends FolderBase {
  type: 'folder';
  parentId: string | null;
}

// Utility function to convert between types
export function toFolderItem(folder: Folder): FolderItem {
  return {
    ...folder,
    type: 'folder'
  };
}

export function fromFolderItem(item: FolderItem): Folder {
  const { type, ...folder } = item;
  return folder;
}
