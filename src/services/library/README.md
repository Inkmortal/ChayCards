# Library Service

A modular and extensible service for managing hierarchical items (folders and documents) with support for various storage backends.

## Usage

### Basic Usage

```typescript
import { createLibraryService } from './services/library';

async function initializeLibrary() {
  // Create with default configuration (filesystem storage)
  const library = await createLibraryService();

  // Create a folder
  const result = await library.createItem({
    name: 'My Folder',
    type: 'folder',
    parentId: null
  });

  // Subscribe to changes
  library.addEventListener((event) => {
    console.log('Item changed:', event);
  });
}
```

### Development Mode

```typescript
import { createDevLibraryService } from './services/library';

async function initializeDevLibrary() {
  // Create with sample data in memory
  const library = await createDevLibraryService();
}
```

### Custom Configuration

```typescript
import { createLibraryService } from './services/library';

async function initializeCustomLibrary() {
  const library = await createLibraryService({
    storageType: 'filesystem',
    basePath: './custom/storage/path',
    isDevelopment: true
  });
}
```

## Features

- Hierarchical item management (folders/documents)
- Conflict resolution
- Event system for changes
- Automatic backups
- Multiple storage backends
- Type-safe operations

## Architecture

The service is composed of several modular components:

- **LibraryService**: Main service interface
- **BaseOperations**: Core CRUD operations
- **QueryOperations**: Search and filtering
- **ConflictHandler**: Conflict resolution
- **EventEmitter**: Event management
- **Storage**: Pluggable storage backends

## Storage Backends

### FileSystemItemStore
- JSON file-based storage
- Automatic backups
- Backup restoration
- Atomic saves

### MemoryItemStore
- In-memory storage
- Useful for testing
- No persistence

## Error Handling

All operations return `OperationResult` with detailed error information:

```typescript
const result = await library.createItem({
  name: 'My Folder',
  type: 'folder',
  parentId: null
});

if (!result.success) {
  console.error('Failed:', result.error);
}
```

## Events

Subscribe to item changes:

```typescript
library.addEventListener((event) => {
  switch (event.type) {
    case 'created':
      console.log('Item created:', event.item);
      break;
    case 'updated':
      console.log('Item updated:', event.item);
      break;
    case 'deleted':
      console.log('Item deleted:', event.item);
      break;
  }
});
