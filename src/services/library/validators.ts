import { Item, ValidationResult } from './types';

export function validateName(
  items: Item[],
  name: string,
  parentId: string | null
): ValidationResult {
  const siblings = items.filter((item: Item) => item.parentId === parentId);
  const nameExists = siblings.some(
    (item: Item) => item.name.toLowerCase() === name.toLowerCase()
  );

  return {
    isValid: !nameExists,
    errors: nameExists ? ['Name already exists in this location'] : undefined
  };
}

export function validateMove(
  items: Item[],
  itemId: string,
  targetId: string | null
): ValidationResult {
  const sourceItem = items.find((item: Item) => item.id === itemId);
  if (!sourceItem) {
    return { isValid: false, errors: ['Source item not found'] };
  }

  if (targetId !== null) {
    const targetItem = items.find((item: Item) => item.id === targetId);
    if (!targetItem) {
      return { isValid: false, errors: ['Target folder not found'] };
    }

    // Check for circular reference
    let current: string | null = targetId;
    while (current !== null) {
      if (current === itemId) {
        return { 
          isValid: false, 
          errors: ['Cannot move folder into its own subfolder'] 
        };
      }
      const parent = items.find((item: Item) => item.id === current);
      current = parent?.parentId || null;
    }
  }

  return { isValid: true };
}
