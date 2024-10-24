# Plugin System Architecture

## Overview

The ChayCards plugin system provides a flexible and extensible architecture for adding new document types to the application. Each plugin can define its own:
- Database schema
- UI components
- Business logic
- Data types

## Core Concepts

### Document Types
All documents in the system inherit from a base document type that provides common properties:
- Unique identifier
- Document type
- Title
- Creation/update timestamps
- Metadata
- Status

### Plugin Interface
Plugins implement the `DocumentTypePlugin` interface, which defines:
- Document type identification
- Schema requirements
- CRUD operations
- UI components
- Validation logic

## Dynamic Schema System

### Plugin Schema Definition
Each plugin can define its database requirements through the `PluginSchema` interface:
```typescript
interface PluginSchema {
  tables: string[]      // SQL statements for table creation
  indexes: string[]     // SQL statements for index creation
  initialData?: string[] // SQL statements for initial data
}
```

### Schema Registration
When a plugin is registered:
1. Core system checks for schema requirements
2. Plugin-specific tables are created
3. Indexes are created for performance
4. Initial data is inserted if provided

### Core Document Table
The system provides a base `documents` table that all plugins extend:
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  metadata TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);
```

## Plugin Structure

### Recommended File Organization
```
src/plugins/your-plugin/
├── components/         # UI Components
│   ├── Editor.tsx     # Document editing interface
│   └── Viewer.tsx     # Document viewing interface
├── plugin.ts          # Main plugin implementation
├── repository.ts      # Database operations
├── schema.ts         # Database schema definition
├── service.ts        # Business logic
└── types.ts          # Type definitions
```

### Component Guidelines
- Keep UI components focused and single-purpose
- Separate editing and viewing concerns
- Use TypeScript for type safety
- Follow React best practices

### Database Guidelines
- Use foreign key constraints for referential integrity
- Create indexes for frequently queried fields
- Keep schema changes backwards compatible
- Document schema design decisions

## Creating a New Plugin

1. Create Plugin Directory
```bash
mkdir src/plugins/your-plugin
```

2. Define Types
```typescript
// types.ts
import { BaseDocument } from '../../core/types/document'

export interface YourDocument extends BaseDocument {
  type: 'your-type'
  // Add custom properties
}
```

3. Define Schema
```typescript
// schema.ts
import { PluginSchema } from '../../core/types/document'

export const yourSchema: PluginSchema = {
  tables: [
    `CREATE TABLE your_table (
      id TEXT PRIMARY KEY REFERENCES documents(id),
      // Add custom fields
    )`
  ],
  indexes: [
    'CREATE INDEX idx_your_index ON your_table(field)'
  ]
}
```

4. Implement Plugin
```typescript
// plugin.ts
import { DocumentTypePlugin } from '../../core/types/document'
import { YourDocument } from './types'
import { yourSchema } from './schema'

export class YourPlugin implements DocumentTypePlugin<YourDocument> {
  readonly type = 'your-type'
  readonly displayName = 'Your Plugin'
  readonly schema = yourSchema

  // Implement required methods
}
```

5. Register Plugin
```typescript
// main/index.ts
import { DocumentTypeRegistry } from '../core/types/document'
import { YourPlugin } from '../plugins/your-plugin/plugin'

DocumentTypeRegistry.registerPlugin(new YourPlugin())
```

## Best Practices

### Schema Design
- Use foreign keys to maintain data integrity
- Create indexes for performance
- Keep related data together
- Use appropriate data types
- Document schema decisions

### Code Organization
- Separate concerns (UI, data, logic)
- Keep files focused and manageable
- Use clear naming conventions
- Write comprehensive documentation

### Type Safety
- Use TypeScript interfaces
- Define clear type boundaries
- Validate data at runtime
- Document type constraints

### Performance
- Create appropriate indexes
- Optimize queries
- Batch operations when possible
- Consider caching strategies

## Example Plugins

- [Flashcards Plugin](./flashcards.md): Implements spaced repetition system
- Notes Plugin: Simple note-taking (coming soon)
- Tasks Plugin: Task management (coming soon)
