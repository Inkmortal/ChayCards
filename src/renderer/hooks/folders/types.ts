import { Folder } from '../../../core/storage/folders/models';
import { FolderConflict } from '../../../core/operations/folders/conflicts';

/**
 * UI state for folder management
 */
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

/**
 * Helper type for rename and move operations
 */
export interface MoveAfterRename {
  targetId: string | null;
}
