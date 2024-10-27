export interface Item {
  id: string;
  name: string;
  type: 'folder' | 'document';
  modifiedAt: string;
  createdAt: string;
}

export interface FolderConflictInfo {
  sourceId: string;
  targetId: string | null;
  sourceName: string;
}

export interface DragState {
  draggedItem: string | null;
  dragOverItem: string | null;
}
