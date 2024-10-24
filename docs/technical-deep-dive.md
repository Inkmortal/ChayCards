# ChayCards Technical Deep Dive

## System Architecture Overview

ChayCards is built as an Electron application with a plugin-based architecture, using React for the frontend and a modular backend system. Here's how it all fits together:

### Core Architecture Components

```
[Electron Main Process]
    │
    ├── Database Service
    │   └── Plugin Data Storage
    │
    ├── Plugin System
    │   └── Plugin Registry
    │
    └── IPC Bridge
            │
            v
[Electron Renderer Process]
    │
    ├── React Frontend
    │   └── Plugin UI Components
    │
    └── State Management
```

## How Everything Works Together

### 1. Application Bootstrap Process

1. **Main Process Initialization**
   ```typescript
   // main/index.ts
   app.whenReady().then(() => {
     // 1. Initialize database
     // 2. Load plugin registry
     // 3. Create window
     // 4. Setup IPC channels
   });
   ```

2. **Plugin Loading**
   - System discovers plugins in src/plugins directory
   - Each plugin registers its document types and UI components
   - Database schema is extended with plugin-specific schemas

3. **Frontend Initialization**
   - React application boots
   - Plugin UI components are registered
   - IPC bridge is established

### 2. Plugin System Architecture

The plugin system is designed for extensibility while maintaining type safety:

```typescript
// Core plugin interface
interface Plugin {
  // Unique identifier
  id: string;
  
  // Document type definitions
  documentTypes: DocumentType[];
  
  // UI Component registry
  components: {
    // React components for different views
    viewer?: React.ComponentType<ViewerProps>;
    editor?: React.ComponentType<EditorProps>;
    // ... other UI points
  };
  
  // Data handlers
  handlers: {
    onCreate?: (doc: Document) => Promise<void>;
    onUpdate?: (doc: Document) => Promise<void>;
    // ... other lifecycle hooks
  };
}
```

#### How to Create a New Plugin

1. Create plugin directory structure:
   ```
   src/plugins/your-plugin/
   ├── plugin.ts         # Plugin registration
   ├── types.ts          # Type definitions
   ├── repository.ts     # Data access
   └── components/       # UI components
   ```

2. Define document types:
   ```typescript
   // types.ts
   interface YourDocumentType extends BaseDocument {
     type: 'your-type';
     // Your custom fields
     customField: string;
   }
   ```

3. Implement repository:
   ```typescript
   // repository.ts
   class YourRepository {
     async create(doc: YourDocumentType): Promise<void> {
       // Implementation
     }
     // Other CRUD operations
   }
   ```

### 3. Database System

The database system uses a flexible schema approach that allows plugins to extend it:

```typescript
// Base schema structure
interface Schema {
  version: number;
  collections: {
    [key: string]: {
      indices: Index[];
      validators: Validator[];
    }
  };
}

// Plugin schema extension
interface PluginSchema extends Schema {
  pluginId: string;
  migrations: Migration[];
}
```

#### Adding New Document Types

1. Define schema:
   ```typescript
   const yourSchema: PluginSchema = {
     version: 1,
     collections: {
       yourDocType: {
         indices: [
           { field: 'title', type: 'string' }
         ],
         validators: [
           validateYourDoc
         ]
       }
     }
   };
   ```

2. Register with database:
   ```typescript
   await database.registerSchema(yourSchema);
   ```

### 4. IPC Communication

The IPC system provides type-safe communication between frontend and backend:

```typescript
// Preload script type definitions
interface IpcApi {
  // Database operations
  database: {
    create: <T extends Document>(doc: T) => Promise<T>;
    update: <T extends Document>(doc: T) => Promise<T>;
    delete: (id: string) => Promise<void>;
    query: <T extends Document>(options: QueryOptions) => Promise<T[]>;
  };
  
  // Plugin operations
  plugins: {
    register: (plugin: Plugin) => Promise<void>;
    getComponent: (pluginId: string, type: string) => Promise<Component>;
  };
}
```

#### Adding New IPC Channels

1. Define in preload:
   ```typescript
   // preload/index.ts
   contextBridge.exposeInMainWorld('electron', {
     yourChannel: (data: YourData) => 
       ipcRenderer.invoke('your-channel', data)
   });
   ```

2. Handle in main:
   ```typescript
   // main/index.ts
   ipcMain.handle('your-channel', async (event, data: YourData) => {
     // Implementation
   });
   ```

### 5. Frontend Architecture

The React frontend uses a component-based architecture with plugin integration:

```typescript
// Plugin component loading
const PluginComponent = React.lazy(() => 
  import(`../plugins/${pluginId}/components`)
);

// Plugin integration point
interface PluginMountPoint {
  pluginId: string;
  component: React.ComponentType<any>;
  props: Record<string, unknown>;
}
```

#### Adding New UI Features

1. Create component:
   ```typescript
   // Your plugin component
   const YourComponent: React.FC<YourProps> = (props) => {
     // Implementation
   };
   ```

2. Register with plugin:
   ```typescript
   // plugin.ts
   export const yourPlugin: Plugin = {
     components: {
       main: YourComponent
     }
   };
   ```

## Development Workflow

1. **Adding New Features**
   - Determine if feature belongs in core or as plugin
   - Create necessary types and interfaces
   - Implement backend functionality
   - Create frontend components
   - Add IPC channels if needed

2. **Modifying Existing Features**
   - Locate relevant plugin/core code
   - Update types as needed
   - Modify implementation
   - Update UI components
   - Test changes

3. **Creating New Document Types**
   - Define document interface
   - Create database schema
   - Implement repository
   - Add UI components
   - Register with plugin system

## Best Practices

1. **Type Safety**
   - Use TypeScript strictly
   - Define interfaces for all data structures
   - Maintain type consistency across IPC boundary

2. **Plugin Development**
   - Keep plugins self-contained
   - Use dependency injection
   - Follow established patterns

3. **Performance**
   - Lazy load components
   - Optimize database queries
   - Batch IPC communications

This technical deep-dive should give you a solid understanding of how the system works and how to extend it. The plugin architecture allows for significant extensibility while maintaining type safety and performance.
