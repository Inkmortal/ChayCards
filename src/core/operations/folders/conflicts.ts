import { Folder } from '../../../core/storage/folders/models';

export interface FolderConflictResult {
  hasConflict: boolean;
  type?: 'name' | 'circular' | 'path';
  conflictingId?: string;
  message?: string;
}

export interface NameConflictResult extends FolderConflictResult {
  type: 'name';
  originalName: string;
  suggestedName: string;
}

/**
 * Represents a folder naming conflict in the UI
 */
export interface FolderConflict {
  sourceId: string;
  targetId: string | null;
  originalName: string;  // Original name that caused the conflict
  suggestedName: string;  // Suggested unique name for resolution
}

export function detectNameConflict(
  name: string,
  parentId: string | null,
  folders: Folder[],
  excludeId?: string
): NameConflictResult | null {
  const siblings = folders.filter(f => f.parentId === parentId);
  const conflictingFolder = siblings.find(
    f => f.id !== excludeId && f.name.toLowerCase() === name.toLowerCase()
  );

  if (conflictingFolder) {
    return {
      hasConflict: true,
      type: 'name',
      conflictingId: conflictingFolder.id,
      originalName: name,
      suggestedName: generateUniqueName(name, siblings),
      message: `A folder named "${name}" already exists in this location`
    };
  }

  return null;
}

export function detectCircularConflict(
  sourceId: string,
  targetId: string | null,
  folders: Folder[]
): FolderConflictResult | null {
  if (!targetId) return null;

  let currentId: string | null = targetId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === sourceId) {
      return {
        hasConflict: true,
        type: 'circular',
        message: 'Cannot move a folder into its own subfolder'
      };
    }
    if (visited.has(currentId)) {
      return {
        hasConflict: true,
        type: 'circular',
        message: 'Circular reference detected in folder structure'
      };
    }

    visited.add(currentId);
    const folder = folders.find(f => f.id === currentId);
    currentId = folder?.parentId || null;
  }

  return null;
}

export function detectMoveConflict(
  sourceId: string,
  targetId: string | null,
  folders: Folder[]
): FolderConflictResult | null {
  const sourceFolder = folders.find(folder => folder.id === sourceId);
  if (!sourceFolder) return null;

  // Check for circular reference first
  const circularConflict = detectCircularConflict(sourceId, targetId, folders);
  if (circularConflict) return circularConflict;

  // Then check for name conflicts
  const nameConflict = detectNameConflict(sourceFolder.name, targetId, folders, sourceId);
  if (nameConflict) return nameConflict;

  return null;
}

function generateUniqueName(baseName: string, existingFolders: Folder[]): string {
  const existingNames = new Set(existingFolders.map(f => f.name.toLowerCase()));
  let newName = `${baseName} (copy)`;

  if (!existingNames.has(newName.toLowerCase())) {
    return newName;
  }

  let counter = 1;
  while (existingNames.has(newName.toLowerCase())) {
    newName = `${baseName} (copy) (${counter})`;
    counter++;
  }

  return newName;
}

export function getFoldersToDelete(
  folders: Folder[],
  folderId: string
): Set<string> {
  const folderIdsToDelete = new Set<string>();
  
  function addDescendants(id: string) {
    folderIdsToDelete.add(id);
    folders
      .filter(f => f.parentId === id)
      .forEach(child => addDescendants(child.id));
  }

  addDescendants(folderId);
  return folderIdsToDelete;
}
