# API Reference

## Core APIs

### Plugin System

```typescript
interface PluginManager {
  // Load a plugin
  load(pluginId: string): Promise<void>;
  
  // Unload a plugin
  unload(pluginId: string): Promise<void>;
  
  // Get plugin instance
  get(pluginId: string): Promise<Plugin | null>;
  
  // List all loaded plugins
  list(): Plugin[];
  
  // Check if plugin is loaded
  isLoaded(pluginId: string): boolean;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  
  onLoad?(): Promise<void>;
  onUnload?(): Promise<void>;
  
  api?: Record<string, unknown>;
}
```

### Document System

```typescript
interface DocumentManager {
  // Create new document
  create(type: string): Promise<Document>;
  
  // Get document by ID
  get(id: string): Promise<Document>;
  
  // Save document
  save(doc: Document): Promise<void>;
  
  // Delete document
  delete(id: string): Promise<void>;
  
  // List documents
  list(query?: Query): Promise<Document[]>;
  
  // Subscribe to document changes
  subscribe(id: string, callback: (doc: Document) => void): () => void;
}

interface Document {
  id: string;
  type: string;
  content: unknown;
  metadata: DocumentMetadata;
}
```

### Event System

```typescript
interface EventManager {
  // Subscribe to event
  on(event: string, callback: (data: unknown) => void): () => void;
  
  // Emit event
  emit(event: string, data?: unknown): void;
  
  // Remove event listener
  off(event: string, callback: (data: unknown) => void): void;
}
```

### Storage System

```typescript
interface StorageManager {
  // Get item
  get(key: string): Promise<unknown>;
  
  // Set item
  set(key: string, value: unknown): Promise<void>;
  
  // Remove item
  remove(key: string): Promise<void>;
  
  // Clear storage
  clear(): Promise<void>;
}
```

## Plugin Development

### Registration

```typescript
// Register a plugin
function registerPlugin(plugin: Plugin): void;

// Register a document type
function registerDocumentType(docType: DocumentType): void;

// Register a view component
function registerView(view: ViewComponent): void;
```

### Extension Points

```typescript
interface ExtensionPoint {
  // Add extension
  add(extension: Extension): void;
  
  // Remove extension
  remove(extensionId: string): void;
  
  // Get all extensions
  getAll(): Extension[];
}
```

### Inter-Plugin Communication

```typescript
// Get plugin API
const otherPlugin = await core.plugins.get('plugin-id');
await otherPlugin.api.someMethod();

// Event-based communication
core.events.on('plugin:event', (data) => {
  // Handle event
});

core.events.emit('my-plugin:event', data);
```

## Document Type Development

### Schema Definition

```typescript
interface DocumentSchema {
  type: string;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

interface SchemaProperty {
  type: string;
  description?: string;
  default?: unknown;
}
```

### View Components

```typescript
interface ViewComponent {
  // Render component
  render(props: ViewProps): JSX.Element;
  
  // Component lifecycle
  onMount?(): void;
  onUnmount?(): void;
}

interface ViewProps {
  document: Document;
  context: ViewContext;
}
```

## Utility APIs

### Search

```typescript
interface SearchManager {
  // Search documents
  search(query: string): Promise<SearchResult[]>;
  
  // Index document
  index(doc: Document): Promise<void>;
  
  // Remove from index
  remove(docId: string): Promise<void>;
}
```

### File System

```typescript
interface FileSystem {
  // Read file
  readFile(path: string): Promise<Buffer>;
  
  // Write file
  writeFile(path: string, data: Buffer): Promise<void>;
  
  // Delete file
  deleteFile(path: string): Promise<void>;
}
```

### UI Components

```typescript
// Modal
interface Modal {
  show(content: JSX.Element): void;
  hide(): void;
}

// Toast
interface Toast {
  show(message: string, options?: ToastOptions): void;
}

// Menu
interface Menu {
  popup(items: MenuItem[]): void;
}
