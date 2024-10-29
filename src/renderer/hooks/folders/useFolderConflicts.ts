import { useState } from 'react';
import { Folder } from '../../../core/storage/folders/models';
import { 
  detectNameConflict, 
  detectMoveConflict,
  NameConflictResult,
  FolderConflict
} from '../../../core/operations/folders/conflicts';

interface UseFolderConflictsReturn {
  folderConflict: FolderConflict | null;
  setFolderConflict: (conflict: FolderConflict | null) => void;
  checkFolderConflict: (sourceId: string, targetId: string | null, folders: Folder[]) => boolean;
}

export function useFolderConflicts(): UseFolderConflictsReturn {
  const [folderConflict, setFolderConflict] = useState<FolderConflict | null>(null);

  const checkFolderConflict = (sourceId: string, targetId: string | null, folders: Folder[]): boolean => {
    const sourceFolder = folders.find(folder => folder.id === sourceId);
    if (!sourceFolder) return false;

    const conflict = detectMoveConflict(sourceId, targetId, folders);
    
    if (conflict?.type === 'name') {
      const nameConflict = conflict as NameConflictResult;
      setFolderConflict({
        sourceId,
        targetId,
        originalName: nameConflict.originalName,
        suggestedName: nameConflict.suggestedName
      });
      return true;
    }

    return false;
  };

  return {
    folderConflict,
    setFolderConflict,
    checkFolderConflict
  };
}
