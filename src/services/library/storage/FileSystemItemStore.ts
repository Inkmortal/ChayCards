import { Item, LibraryError } from '../types';
import { ItemStore } from '../ItemStore';
import { loadFolders, saveFolders } from './bridge';

const DEBUG = process.env.NODE_ENV === 'development';

export class FileSystemItemStore implements ItemStore {
  private items: Map<string, Item> = new Map();
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    try {
      if (DEBUG) console.log('FileSystemItemStore: Initializing...');
      const data = await loadFolders();
      
      if (DEBUG) {
        console.log('FileSystemItemStore: Loaded data:', data);
        console.log('FileSystemItemStore: Data type:', typeof data);
        console.log('FileSystemItemStore: Has folders?', data?.folders != null);
      }

      if (!data || !data.folders) {
        if (DEBUG) console.error('FileSystemItemStore: Invalid data structure:', data);
        throw new Error('Invalid data structure received from storage');
      }

      this.items.clear();
      data.folders.forEach(item => this.items.set(item.id, item));
      this.initialized = true;

      if (DEBUG) {
        console.log('FileSystemItemStore: Initialization complete');
        console.log('FileSystemItemStore: Loaded items count:', this.items.size);
      }
    } catch (error) {
      console.error('FileSystemItemStore: Initialization failed:', error);
      throw new LibraryError(
        'Failed to initialize storage',
        (error as Error).message || 'Unknown error during initialization'
      );
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      if (DEBUG) console.log('FileSystemItemStore: Auto-initializing...');
      await this.initialize();
    }
  }

  async getItems(): Promise<Item[]> {
    try {
      await this.ensureInitialized();
      return Array.from(this.items.values());
    } catch (error) {
      console.error('FileSystemItemStore: Failed to get items:', error);
      throw new LibraryError(
        'Failed to load items from storage',
        (error as Error).message
      );
    }
  }

  async getItem(id: string): Promise<Item | null> {
    await this.ensureInitialized();
    return this.items.get(id) || null;
  }

  async addItem(item: Item): Promise<void> {
    await this.ensureInitialized();
    this.items.set(item.id, item);
    await this.save();
  }

  async updateItem(item: Item): Promise<void> {
    await this.ensureInitialized();
    if (!this.items.has(item.id)) {
      throw new LibraryError('Item not found', 'ITEM_NOT_FOUND');
    }
    this.items.set(item.id, item);
    await this.save();
  }

  async deleteItem(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.items.has(id)) {
      throw new LibraryError('Item not found', 'ITEM_NOT_FOUND');
    }
    this.items.delete(id);
    await this.save();
  }

  async getItemsToDelete(id: string): Promise<Item[]> {
    await this.ensureInitialized();
    const result: Item[] = [];
    const item = this.items.get(id);
    if (!item) return result;

    const addChildren = (parentId: string) => {
      for (const [, item] of this.items) {
        if (item.parentId === parentId) {
          result.push(item);
          addChildren(item.id);
        }
      }
    };

    result.push(item);
    addChildren(id);
    return result;
  }

  private async save(): Promise<void> {
    try {
      if (DEBUG) console.log('FileSystemItemStore: Saving items...');
      const data = {
        folders: Array.from(this.items.values()),
        version: 1,
        lastBackup: new Date().toISOString()
      };
      await saveFolders(data);
      if (DEBUG) console.log('FileSystemItemStore: Save complete');
    } catch (error) {
      console.error('FileSystemItemStore: Save failed:', error);
      throw new LibraryError(
        'Failed to save items to storage',
        (error as Error).message
      );
    }
  }

  async restore(): Promise<void> {
    try {
      if (DEBUG) console.log('FileSystemItemStore: Restoring from backup...');
      await this.initialize();
      if (DEBUG) console.log('FileSystemItemStore: Restore complete');
    } catch (error) {
      console.error('FileSystemItemStore: Restore failed:', error);
      throw new LibraryError(
        'Failed to restore from backup',
        (error as Error).message
      );
    }
  }
}
