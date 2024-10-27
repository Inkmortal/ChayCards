import { Item } from './types';

export function getUniqueFolderName(
  items: Item[],
  baseName: string,
  parentId: string | null
): string {
  const nameWithoutCounter = baseName.replace(/ \(\d+\)$/, '');
  const existingNames = new Set(
    items
      .filter(item => item.parentId === parentId)
      .map(item => item.name.toLowerCase())
  );

  if (!existingNames.has(nameWithoutCounter.toLowerCase())) {
    return nameWithoutCounter;
  }

  let counter = 1;
  let newName = `${nameWithoutCounter} (${counter})`;
  while (existingNames.has(newName.toLowerCase())) {
    counter++;
    newName = `${nameWithoutCounter} (${counter})`;
  }

  return newName;
}
