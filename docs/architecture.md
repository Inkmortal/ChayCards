# Architecture Deep Dive

## System Architecture

ChayCards is built on a modular, offline-first architecture with these key components:

```
┌─────────────────────────────────────────────────────────┐
│                    Electron App                         │
├─────────────┬───────────────────────┬──────────────────┤
│  Main       │      Renderer         │    Preload       │
│  Process    │      Process          │    Scripts       │
└─────────────┴───────────────────────┴──────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                    Core Systems                         │
├──────────────┬──────────────┬───────────────┬──────────┤
│   Plugin     │  Document    │    Event      │  Storage │
│   System     │  System      │    System     │  System  │
└──────────────┴──────────────┴───────────────┴──────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                    Plugin Layer                         │
├──────────────┬──────────────┬───────────────┬──────────┤
│  Document    │   UI         │  Feature      │ Service  │
│   Types      │  Components  │   Plugins     │ Plugins  │
└──────────────┴──────────────┴───────────────┴──────────┘
```

## File System Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Application Root                     │
├─────────────┬───────────────────────┬──────────────────┤
│   data/     │     plugins/          │    backups/      │
├─────────────┼───────────────────────┼──────────────────┤
│ documents/  │  markdown-plugin/     │  backup-latest/  │
│ metadata.db │  flashcards-plugin/   │  backup-daily/   │
│ indexes/    │  canvas-plugin/       │  backup-weekly/  │
└─────────────┴───────────────────────┴──────────────────┘
```

### Document Storage Structure

```
┌─────────────────────────────────────────────┐
│ documents/                                  │
├─────────────┬───────────────┬──────────────┤
│ [doc-id]/   │ [doc-id]/     │ [doc-id]/    │
├─────────────┼───────────────┼──────────────┤
│content.json │content.json   │content.json  │
│metadata.json│metadata.json  │metadata.json │
│assets/      │assets/        │assets/       │
│versions/    │versions/      │versions/     │
└─────────────┴───────────────┴──────────────┘
```

### Core Systems

1. **Plugin System**
   - Manual plugin installation via filesystem
   - Local dependency resolution
   - Plugin validation and loading
   - Sandboxed execution

2. **Document System**
   - File-based document storage
   - Local search indexing
   - Version history
   - Asset management

3. **Event System**
   - Local event bus
   - Inter-plugin communication
   - State synchronization

4. **Storage System**
   - File system operations
   - SQLite metadata database
   - Local backup/restore
   - Search indexing

## Data Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   User       │    │   Plugin     │    │   Document   │
│  Action      │── >│   System     │── >│   System     │
└──────────────┘    └──────────────┘    └──────────────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐    ┌──────────────┐
                    │    Event     │    │   Storage    │
                    │   System     │    │   System     │
                    └──────────────┘    └──────────────┘
```

## File System Operations

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Document    │    │    File      │    │   SQLite     │
│   System     │───>│   System     │───>│  Database    │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                    │
       │                   ▼                    ▼
       │            ┌──────────────┐    ┌──────────────┐
       └───────────>│   Search     │    │   Backup     │
                    │    Index     │    │   System     │
                    └──────────────┘    └──────────────┘
```

## Plugin Architecture

```
┌──────────────────────────────────────────┐
│              Plugin Directory            │
├──────────────┬──────────────┬────────────┤
│  manifest    │    dist/     │  assets/   │
│  .json       │              │            │
├──────────────┼──────────────┼────────────┤
│  - metadata  │  - compiled  │ - icons    │
│  - version   │    code      │ - styles   │
│  - deps      │  - types     │ - media    │
└──────────────┴──────────────┴────────────┘
```

Plugins are self-contained modules that can:

1. **Add New Features**
   ```typescript
   interface FeaturePlugin {
     id: string;
     features: Feature[];
     activate(): void;
     deactivate(): void;
   }
   ```

2. **Extend Existing Features**
   ```typescript
   interface Extension {
     target: string;
     point: string;
     component: Component;
   }
   ```

3. **Provide Services**
   ```typescript
   interface ServicePlugin {
     id: string;
     api: Record<string, Function>;
     start(): Promise<void>;
     stop(): Promise<void>;
   }
   ```

## Document Type System

Document types are plugins that define:

1. **Data Structure**
   ```typescript
   interface DocumentSchema {
     type: string;
     properties: SchemaProperties;
     validate(data: unknown): boolean;
   }
   ```

2. **UI Components**
   ```typescript
   interface DocumentUI {
     editor: Component;
     viewer: Component;
     toolbar?: Component;
   }
   ```

3. **Behavior**
   ```typescript
   interface DocumentBehavior {
     onCreate(): void;
     onSave(): void;
     onDelete(): void;
   }
   ```

## State Management

```
┌──────────────┐
│  Document    │
│   Store      │
└──────────────┘
       ▲
       │
┌──────────────┐    ┌──────────────┐
│   Action     │<───│    View      │
│  Handlers    │    │  Components  │
└──────────────┘    └──────────────┘
       │
       ▼
┌──────────────┐
│   Storage    │
│   System     │
└──────────────┘
```

## Local Search Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Document    │    │   Index      │    │   Search     │
│  Changes     │───>│  Builder     │───>│   Engine     │
└──────────────┘    └──────────────┘    └──────────────┘
                           │                    ▲
                           ▼                    │
                    ┌──────────────┐    ┌──────────────┐
                    │    Index     │    │    Query     │
                    │    Files     │───>│  Processor   │
                    └──────────────┘    └──────────────┘
```

## Security Model

1. **Plugin Isolation**
   - Sandboxed execution
   - Limited API access
   - Resource constraints

2. **Permission System**
   ```typescript
   interface PluginPermissions {
     storage: boolean;
     filesystem: boolean;
   }
   ```

3. **API Access Control**
   ```typescript
   interface APIAccess {
     scope: string[];
     level: 'read' | 'write' | 'admin';
   }
   ```

## Performance Considerations

1. **Lazy Loading**
   - Plugins loaded on demand
   - Document content loaded as needed
   - UI components dynamically imported

2. **Caching**
   - Document cache
   - Plugin resource cache
   - Search index cache

3. **Resource Management**
   ```typescript
   interface ResourceManager {
     allocate(plugin: string, resource: Resource): void;
     release(plugin: string, resource: Resource): void;
     monitor(): ResourceStats;
   }
   ```

## Error Handling

1. **Plugin Errors**
   ```typescript
   interface PluginError {
     plugin: string;
     type: ErrorType;
     message: string;
     stack?: string;
   }
   ```

2. **Recovery Strategies**
   - Plugin isolation
   - State rollback
   - Automatic restart

## Testing Architecture

1. **Unit Tests**
   - Core systems
   - Plugin API
   - Document types

2. **Integration Tests**
   - Plugin interaction
   - Document operations
   - State management

3. **E2E Tests**
   - User workflows
   - Plugin scenarios
   - Performance tests
