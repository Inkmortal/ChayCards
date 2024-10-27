import { LibraryService } from './LibraryService';
import { FileSystemItemStore } from './storage/FileSystemItemStore';
import { MemoryItemStore } from './storage/MemoryItemStore';
import { ItemStore } from './ItemStore';

const DEBUG = process.env.NODE_ENV === 'development';

interface LibraryServiceOptions {
  isDevelopment?: boolean;
  store?: ItemStore;
}

async function createStore(options: LibraryServiceOptions): Promise<ItemStore> {
  try {
    if (DEBUG) console.log('Factory: Creating store...');
    
    if (options.store) {
      if (DEBUG) console.log('Factory: Using provided store');
      return options.store;
    }

    const store = options.isDevelopment
      ? new MemoryItemStore()
      : new FileSystemItemStore();

    if (DEBUG) {
      console.log('Factory: Created store type:', 
        options.isDevelopment ? 'MemoryItemStore' : 'FileSystemItemStore'
      );
    }

    await store.initialize();
    if (DEBUG) console.log('Factory: Store initialized');
    
    return store;
  } catch (error) {
    console.error('Factory: Failed to create store:', error);
    throw error;
  }
}

export async function createLibraryService(options: LibraryServiceOptions = {}): Promise<LibraryService> {
  try {
    if (DEBUG) console.log('Factory: Creating LibraryService...');
    const store = await createStore(options);
    const service = new LibraryService(store);
    if (DEBUG) console.log('Factory: LibraryService created successfully');
    return service;
  } catch (error) {
    console.error('Factory: Failed to create LibraryService:', error);
    throw error;
  }
}
