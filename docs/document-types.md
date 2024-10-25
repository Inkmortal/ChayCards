# Document Types Guide

## Overview
Document types are the foundation of content in ChayCards. This guide explains how to create new document types and extend existing ones.

## Document Type Structure

```typescript
interface DocumentType {
  type: string;              // Unique identifier
  name: string;             // Display name
  description: string;      // Document type description
  icon: string;            // Icon for UI display
  
  // Document schema
  schema: JSONSchema;
  
  // View components
  defaultView: Component;
  views?: Record<string, Component>;
  
  // Document operations
  operations: {
    create?: () => Promise<void>;
    load?: (data: unknown) => Promise<void>;
    save?: () => Promise<unknown>;
    delete?: () => Promise<void>;
  };
  
  // Extension points
  extensionPoints?: {
    toolbar?: ExtensionPoint;
    sidebar?: ExtensionPoint;
    context?: ExtensionPoint;
  };
}
```

## Creating a Basic Document Type

```typescript
// markdown-document.ts
import { DocumentType } from '@chaycards/core';

const MarkdownDocument: DocumentType = {
  type: 'markdown',
  name: 'Markdown Note',
  description: 'A markdown-formatted document',
  icon: 'markdown-icon.svg',
  
  schema: {
    type: 'object',
    properties: {
      content: { type: 'string' },
      metadata: {
        type: 'object',
        properties: {
          tags: { type: 'array', items: { type: 'string' } },
          created: { type: 'string', format: 'date-time' },
          modified: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  
  defaultView: MarkdownEditor,
  
  views: {
    preview: MarkdownPreview,
    split: MarkdownSplitView
  },
  
  operations: {
    async create() {
      return {
        content: '',
        metadata: {
          tags: [],
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        }
      };
    },
    
    async save(doc) {
      doc.metadata.modified = new Date().toISOString();
      await storage.save(doc);
    }
  },
  
  extensionPoints: {
    toolbar: {
      position: 'top',
      allowMultiple: true
    },
    sidebar: {
      position: 'right',
      allowMultiple: true
    }
  }
};
```

## Extension Points

Document types can define extension points where plugins can add functionality:

```typescript
interface ExtensionPoint {
  position: 'top' | 'bottom' | 'left' | 'right';
  allowMultiple: boolean;
  priority?: number;
}

interface DocumentExtension {
  target: string;           // Document type to extend
  component: Component;     // Extension component
  extensionPoint: string;  // Where to add the extension
  priority?: number;      // Extension priority
}
```

## Example: Flashcard Document Type

```typescript
const FlashcardDocument: DocumentType = {
  type: 'flashcard',
  name: 'Flashcard Deck',
  
  schema: {
    type: 'object',
    properties: {
      cards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            front: { type: 'string' },
            back: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            metadata: {
              type: 'object',
              properties: {
                created: { type: 'string', format: 'date-time' },
                lastReviewed: { type: 'string', format: 'date-time' },
                reviewCount: { type: 'number' }
              }
            }
          }
        }
      }
    }
  },
  
  defaultView: FlashcardEditor,
  
  views: {
    study: FlashcardStudyView,
    stats: FlashcardStatsView
  },
  
  extensionPoints: {
    studyMode: {
      position: 'right',
      allowMultiple: true
    }
  }
};
```

## Document State Management

```typescript
// Using the document store
const doc = await documents.get(docId);

// Subscribe to changes
documents.subscribe(docId, (newState) => {
  // Handle document updates
});

// Update document
await documents.update(docId, (doc) => {
  doc.content = newContent;
  return doc;
});
```

## Best Practices

1. **Schema Validation**: Always validate document data against the schema
2. **Extension Points**: Define clear extension points for plugin integration
3. **State Management**: Use the document store for state management
4. **Performance**: Implement efficient save/load operations
5. **Error Handling**: Provide clear error messages for invalid operations

## Testing Document Types

```typescript
import { createTestDocument } from '@chaycards/testing';

describe('Markdown Document', () => {
  let doc;
  
  beforeEach(() => {
    doc = createTestDocument(MarkdownDocument);
  });
  
  it('should create empty document', async () => {
    const newDoc = await doc.operations.create();
    expect(newDoc.content).toBe('');
    expect(newDoc.metadata.tags).toEqual([]);
  });
});
