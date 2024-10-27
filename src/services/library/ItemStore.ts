import { Item } from './types';

/**
 * Interface for item storage operations
 */
export interface ItemStore {
  getItem(id: string): Promise<Item | null>;
  getItems(): Item[];
  addItem(item: Item): Promise<void>;
  updateItem(item: Item): Promise<void>;
  deleteItem(id: string): Promise<void>;
  getItemsToDelete(id: string): Promise<Item[]>;
}

/**
 * In-memory implementation of ItemStore
 */
export class MemoryItemStore implements ItemStore {
  private items: Map<string, Item> = new Map();

  async getItem(id: string): Promise<Item | null> {
    return this.items.get(id) || null;
  }

  getItems(): Item[] {
    return Array.from(this.items.values());
  }

  async addItem(item: Item): Promise<void> {
    this.items.set(item.id, item);
  }

  async updateItem(item: Item): Promise<void> {
    this.items.set(item.id, item);
  }

  async deleteItem(id: string): Promise<void> {
    this.items.delete(id);
  }

  async getItemsToDelete(id: string): Promise<Item[]> {
    const itemsToDelete: Item[] = [];
    const addChildren = (parentId: string) => {
      for (const item of this.items.values()) {
        if (item.parentId === parentId) {
          itemsToDelete.push(item);
          addChildren(item.id);
        }
      }
    };

    const item = this.items.get(id);
    if (item) {
      itemsToDelete.push(item);
      addChildren(id);
    }

    return itemsToDelete;
  }
}
