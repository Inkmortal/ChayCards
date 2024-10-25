# Plugin Development Guide

## Overview
This guide explains how to create plugins for ChayCards. Plugins can add new features, document types, or extend existing functionality.

## Plugin Structure
```typescript
interface Plugin {
  id: string;                 // Unique identifier
  name: string;              // Display name
  version: string;           // Semantic version
  description: string;       // Plugin description
  author: string;           // Author information
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
  
  // API exposure
  api?: Record<string, unknown>;
}
```

## Creating a Basic Plugin

```typescript
// example-plugin.ts
import { Plugin, registerPlugin } from '@chaycards/core';

const ExamplePlugin: Plugin = {
  id: 'com.example.plugin',
  name: 'Example Plugin',
  version: '1.0.0',
  description: 'An example plugin',
  author: 'Your Name',
  
  async onLoad() {
    // Plugin initialization code
    console.log('Plugin loaded!');
  },
  
  async onUnload() {
    // Cleanup code
    console.log('Plugin unloaded!');
  }
};

registerPlugin(ExamplePlugin);
```

## Adding a New Document Type

```typescript
// flashcard-plugin.ts
import { Plugin, DocumentType } from '@chaycards/core';

const FlashcardDocument: DocumentType = {
  type: 'flashcard',
  name: 'Flashcard Deck',
  icon: 'card-icon.svg',
  
  // Document structure
  schema: {
    cards: [{
      front: 'string',
      back: 'string',
      tags: ['string']
    }]
  },
  
  // Default view component
  defaultView: FlashcardView,
  
  // Additional views
  views: {
    study: StudyView,
    edit: EditView
  }
};

const FlashcardPlugin: Plugin = {
  // ... plugin metadata ...
  
  documentTypes: [FlashcardDocument]
};
```

## Extending Existing Document Types

```typescript
// ai-assistant-plugin.ts
const AIAssistantPlugin: Plugin = {
  // ... plugin metadata ...
  
  extends: {
    documentTypes: [{
      target: 'markdown',  // Extend markdown documents
      
      // Add AI-powered features
      components: [{
        type: 'toolbar',
        component: AIToolbarButton
      }],
      
      // Add AI processing capabilities
      api: {
        analyzeText: async (text: string) => {
          // AI processing logic
        }
      }
    }]
  }
};
```

## Plugin Communication

```typescript
// Using another plugin's API
const otherPlugin = await core.plugins.get('com.example.other-plugin');
if (otherPlugin) {
  const result = await otherPlugin.api.someFunction();
}

// Event-based communication
core.events.on('document:changed', (doc) => {
  // React to document changes
});

// Publishing events
core.events.emit('my-plugin:event', data);
```

## Best Practices

1. **Version Dependencies**: Clearly specify version requirements for dependencies
2. **Error Handling**: Gracefully handle missing dependencies or API changes
3. **Resource Management**: Clean up resources in onUnload
4. **API Documentation**: Document your plugin's API for other developers
5. **Performance**: Lazy load resources and avoid blocking operations

## Testing

```typescript
import { createTestPlugin } from '@chaycards/testing';

describe('My Plugin', () => {
  let plugin;
  
  beforeEach(() => {
    plugin = createTestPlugin(MyPlugin);
  });
  
  it('should initialize correctly', async () => {
    await plugin.load();
    expect(plugin.isLoaded).toBe(true);
  });
});
```

## Publishing

1. Package your plugin:
```bash
npm run build-plugin
```

2. Create a plugin manifest:
```json
{
  "id": "com.example.plugin",
  "version": "1.0.0",
  "main": "dist/plugin.js",
  "dependencies": {
    "com.example.other-plugin": "^1.0.0"
  }
}
```

3. Submit to the ChayCards marketplace
