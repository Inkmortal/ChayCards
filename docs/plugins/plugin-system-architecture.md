# Plugin System Architecture

## Overview

The ChayCards plugin system provides a flexible and extensible architecture for adding new document types. Each plugin is a self-contained module that implements the `DocumentTypePlugin` interface.

## Core Concepts

### Document Types

All documents inherit from the `BaseDocument` interface:
```typescript
interface BaseDocument {
  id: string;
  type: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  metadata: Record<string, any>;
}
```

### Plugin Interface

```typescript
interface DocumentTypePlugin<T extends BaseDocument> {
  type: string;
  displayName: string;
  schema: any;
  validateDocument(doc: T): Promise<boolean>;
  createDocument(data: Partial<T>): Promise<T>;
  updateDocument(id: string, data: Partial<T>): Promise<T>;
  deleteDocument(id: string): Promise<void>;
  getAllDocuments(): Promise<T[]>;
  EditorComponent: ComponentType<{ document?: T; onSave: (doc: Partial<T>) => Promise<void> }>;
  ViewerComponent: ComponentType<{ document: T }>;
}
```

## Implementation Guide

### 1. Define Types

```typescript
interface YourDocument extends BaseDocument {
  type: 'your-type';
  // Add custom properties
}
```

### 2. Create Schema

```typescript
const schema = `
  CREATE TABLE IF NOT EXISTS your_table (
    id TEXT PRIMARY KEY REFERENCES documents(id),
    // Add custom fields
  );
`;
```

### 3. Implement Components

```typescript
const Editor: React.FC<EditorProps> = ({ document, onSave }) => {
  // Implement editor UI
};

const Viewer: React.FC<ViewerProps> = ({ document }) => {
  // Implement viewer UI
};
```

### 4. Create Plugin Class

```typescript
export class YourPlugin implements DocumentTypePlugin<YourDocument> {
  type = 'your-type';
  displayName = 'Your Plugin';
  schema = schema;
  
  // Implement required methods
  async createDocument(data: Partial<YourDocument>): Promise<YourDocument> {
    // Implementation
  }
  
  // ... other methods
}
```

## Integration

### Main Process

The main process manages plugin registration and IPC communication:

```typescript
const registry = new DocumentTypeRegistry();
registry.registerPlugin(new YourPlugin());
```

### IPC Handlers

```typescript
ipcMain.handle('get-plugins', () => {
  return registry.getAllPlugins();
});

ipcMain.handle('get-all-documents', async () => {
  const allDocs = [];
  for (const plugin of registry.getAllPlugins()) {
    const docs = await plugin.getAllDocuments();
    allDocs.push(...docs);
  }
  return allDocs;
});
```

## Best Practices

1. **Type Safety**
   - Use TypeScript interfaces
   - Validate data at runtime
   - Handle errors gracefully

2. **UI Components**
   - Follow React patterns
   - Use composition
   - Handle loading/error states

3. **Database Operations**
   - Use transactions where appropriate
   - Handle concurrent operations
   - Validate data before saving

4. **Testing**
   - Test plugin methods
   - Test UI components
   - Test IPC communication

## Example Plugins

- Notes Plugin: Simple markdown notes
- (Future) Tasks Plugin: Task management
- (Future) Flashcards Plugin: Spaced repetition system
