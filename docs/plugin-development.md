# Plugin Development Guide

## Overview
ChayCards plugins are TypeScript modules that extend the application's functionality. Plugins can add new features, document types, or extend existing functionality, all with hot-reloading support during development.

## Quick Start

1. Create a new plugin:
```bash
# Copy example plugin
cp -r plugins/src/example plugins/src/my-plugin
```

2. Implement your plugin:
```typescript
import { Plugin } from '../types';

const MyPlugin: Plugin = {
  id: 'com.example.my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'My awesome plugin',
  author: 'Your Name',

  async onLoad() {
    // Plugin initialization
  },

  async onUnload() {
    // Cleanup
  }
};

export default MyPlugin;
```

3. Test your plugin:
```bash
npm run test:plugins
```

## Plugin Structure

### Core Interface
```typescript
interface Plugin {
  // Required metadata
  id: string;                 // Unique identifier
  name: string;              // Display name
  version: string;           // Semantic version
  description: string;       // Plugin description
  author: string;           // Author information
  
  // Optional dependencies
  dependencies?: string[];  // Other required plugins
  
  // Lifecycle hooks
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  
  // Extension points
  extends?: {
    documentTypes?: DocumentTypeExtension[];
    views?: ViewExtension[];
    components?: ComponentExtension[];
  }
  
  // Public API
  api?: Record<string, unknown>;
}
```

### Extension Types

```typescript
interface DocumentTypeExtension {
  target: string;            // Document type to extend
  components?: ComponentExtension[];
  api?: Record<string, unknown>;
}

interface ViewExtension {
  target: string;           // View to extend
  component: React.ComponentType<any>;
}

interface ComponentExtension {
  type: 'toolbar' | 'sidebar' | 'menu';
  component: React.ComponentType<any>;
}
```

## Development Workflow

### Hot Reloading
Plugins support hot reloading during development:
1. Start development server: `npm run dev`
2. Edit plugin code
3. Changes are automatically reloaded

### Testing
Plugins use Jest for testing:
```typescript
// my-plugin.test.ts
import MyPlugin from './my-plugin';

describe('My Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', async () => {
    await MyPlugin.onLoad?.();
    // Add assertions
  });
});
```

### Building
Plugins are automatically included in production builds:
```bash
npm run build:vite          # Build application
npx electron-builder --dir  # Create executable
```

## Plugin API

### Event System
```typescript
// Subscribe to events
core.events.on('document:changed', (doc) => {
  // Handle document changes
});

// Publish events
core.events.emit('my-plugin:event', data);
```

### Extending Document Types
```typescript
const MyPlugin: Plugin = {
  // ... plugin metadata ...
  
  extends: {
    documentTypes: [{
      target: 'markdown',
      components: [{
        type: 'toolbar',
        component: MyToolbarButton
      }],
      api: {
        processDocument: async (doc) => {
          // Custom document processing
        }
      }
    }]
  }
};
```

### Adding Views
```typescript
const MyPlugin: Plugin = {
  // ... plugin metadata ...
  
  extends: {
    views: [{
      target: 'document-viewer',
      component: MyCustomView
    }]
  }
};
```

## Best Practices

### Plugin Design
1. Keep plugins focused and modular
2. Use TypeScript for type safety
3. Document your plugin's API
4. Handle errors gracefully
5. Clean up resources in onUnload

### Testing
1. Write tests for critical functionality
2. Mock external dependencies
3. Test error conditions
4. Verify cleanup on unload

### Performance
1. Lazy load resources
2. Minimize startup impact
3. Cache expensive operations
4. Profile plugin performance

## Debugging

### Development Tools
- Use React DevTools for components
- Console logging available
- TypeScript debugging enabled
- Source maps supported

### Common Issues
1. Hot Reload Not Working
   - Check file paths
   - Verify plugin structure
   - Check for syntax errors

2. Type Errors
   - Verify interface implementation
   - Check import paths
   - Update type definitions

3. Runtime Errors
   - Check error console
   - Verify dependencies
   - Test error handling

## Distribution

### Plugin Package Structure
```
my-plugin/
├── dist/           # Compiled code
├── src/            # Source code
│   ├── index.ts    # Main entry
│   └── components/ # React components
├── test/           # Test files
└── package.json    # Plugin metadata
```

### Plugin Manifest
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "dependencies": {
    // Plugin dependencies
  }
}
