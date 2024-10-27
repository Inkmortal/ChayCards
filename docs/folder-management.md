# Folder Management System Documentation

## Overview

The folder management system provides a robust, file-based storage solution for managing folder structures in ChayCards. It implements automatic backups, data validation, and recovery mechanisms without requiring a database.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Folder Management                   │
├─────────────────┬─────────────────┬─────────────────┤
│   Main Process  │    Preload      │    Renderer     │
│   (folders.ts)  │   (index.ts)    │  (useFolders.ts)│
└─────────────────┴─────────────────┴─────────────────┘
```

### Data Storage Location

All folder data is stored in the application's user data directory:
- Windows: `%APPDATA%/ChayCards/data/`
- macOS: `~/Library/Application Support/ChayCards/data/`
- Linux: `~/.config/ChayCards/data/`

### File Structure

```
data/
├── folders.json     # Main folder data
└── backups/        # Automatic backups
    ├── folders-2023-06-01T10-30-45Z.json
    ├── folders-2023-06-01T11-45-30Z.json
    └── ...
```

## Data Format

### folders.json

```json
{
  "folders": [
    {
      "id": "123",
      "name": "My Folder",
      "parentId": null,
      "createdAt": "2023-06-01T10:30:45Z",
      "modifiedAt": "2023-06-01T10:30:45Z"
    }
  ],
  "version": 1,
  "lastBackup": "2023-06-01T10:30:45Z"
}
```

## Core Components

### 1. Main Process (src/main/api/folders.ts)

Handles file system operations and data management:
- Loading and saving folder data
- Creating and managing backups
- Data validation
- Error handling and recovery

Key functions:
```typescript
loadFolders(): Promise<FolderData>
saveFolders(data: FolderData): Promise<void>
restoreFromBackup(backupFile?: string): Promise<FolderData>
```

### 2. Preload Script (src/preload/index.ts)

Provides secure IPC communication between renderer and main processes:
- Exposes validated channels
- Handles event listeners
- Manages security boundaries

Available channels:
- `load-folders`
- `save-folders`
- `restore-folders`
- `folders-updated`

### 3. Renderer Hook (src/renderer/hooks/useFolders.ts)

Provides React components with folder management capabilities:
- CRUD operations for folders
- Navigation
- State management
- Error handling
- Backup restoration

## Safety Features

1. **Automatic Backups**
   - Created on every save operation
   - Maintains last 5 backups
   - Rotates old backups automatically

2. **Data Validation**
   - Validates data structure before saving
   - Ensures data integrity
   - Prevents corruption

3. **Error Recovery**
   - Graceful fallback to empty state
   - Backup restoration
   - Error logging

4. **Multi-window Support**
   - Synchronizes changes across windows
   - Handles concurrent modifications
   - Cleans up event listeners

## Usage Examples

### Creating a Folder
```typescript
const { handleCreateFolder, openCreateModal } = useFolders();

// Open create modal
openCreateModal(parentId);

// Create folder
await handleCreateFolder();
```

### Navigating Folders
```typescript
const { navigateFolder, navigateBack } = useFolders();

// Navigate to specific folder
navigateFolder(folderId);

// Navigate to parent folder
navigateBack();
```

### Restoring from Backup
```typescript
const { restoreFromBackup } = useFolders();

// Restore latest backup
await restoreFromBackup();
```

## Error Handling

1. **File System Errors**
   - Handles read/write failures
   - Creates missing directories
   - Validates file permissions

2. **Data Validation Errors**
   - Checks data structure
   - Validates folder relationships
   - Prevents duplicate names

3. **Runtime Errors**
   - Handles async operation failures
   - Provides error feedback
   - Maintains data consistency

## Best Practices

1. **Data Operations**
   - Always use provided hooks and methods
   - Don't modify folder structure directly
   - Handle async operations properly

2. **Error Handling**
   - Always catch potential errors
   - Provide user feedback
   - Log errors appropriately

3. **Backup Management**
   - Regularly test backup restoration
   - Monitor backup creation
   - Maintain backup rotation

## Limitations

1. **Concurrent Operations**
   - Last write wins in case of conflicts
   - No real-time conflict resolution
   - Basic multi-window synchronization

2. **Performance**
   - All data loaded in memory
   - Limited to reasonable folder counts
   - No pagination or lazy loading

3. **Query Capabilities**
   - Basic filtering only
   - No complex queries
   - No full-text search

## Future Improvements

1. **Potential Enhancements**
   - SQLite migration path
   - Better conflict resolution
   - Advanced search capabilities
   - Folder sharing features

2. **Performance Optimizations**
   - Lazy loading
   - Data pagination
   - Caching improvements

3. **Feature Additions**
   - Folder metadata
   - Custom sorting
   - Tags and categories
   - Export/import functionality
