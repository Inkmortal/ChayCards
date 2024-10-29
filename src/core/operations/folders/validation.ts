import { Folder } from '../../../core/storage/folders/models';

export async function validateFolderName(
  name: string,
  parentId: string | null,
  folders: Folder[]
): Promise<boolean> {
  if (!name.trim()) {
    return false;
  }

  const siblings = folders.filter(f => f.parentId === parentId);
  return !siblings.some(f => f.name.toLowerCase() === name.toLowerCase());
}

export function wouldCreateCircularReference(
  sourceId: string,
  targetId: string | null,
  folders: Folder[]
): boolean {
  if (!targetId) return false;

  let currentId: string | null = targetId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === sourceId) return true;
    if (visited.has(currentId)) return true;

    visited.add(currentId);
    const folder = folders.find(f => f.id === currentId);
    currentId = folder?.parentId || null;
  }

  return false;
}
