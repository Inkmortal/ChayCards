# Plugin System Documentation

## Overview

The plugin system in ChayCards enables extending the application with new document types and views without modifying the core application code. Each plugin is a self-contained module that can define its own:
- Document types and schemas
- UI components and views
- Data access patterns
- Business logic

## Plugin Structure

A typical plugin contains:

```
plugins/[plugin-name]/
├── plugin.ts          # Plugin registration and configuration
├── types.ts          # TypeScript types for plugin-specific data
├── repository.ts     # Data access layer
└── components/       # UI components (optional)
```

## How Plugins Work

1. **Registration**
   - Plugins register themselves with the core application
   - They declare their document types and schemas
   - They provide UI components for rendering their content

2. **Document Types**
   - Each plugin can define multiple document types
   - Document types extend the base document interface
   - Plugins handle validation and processing of their types

3. **Data Storage**
   - Plugins use repositories to manage their data
   - The core database service handles persistence
   - Each plugin maintains its own data access patterns

4. **UI Integration**
   - Plugins can provide custom views and components
   - The main application loads these dynamically
   - Plugin UI components receive necessary context and data

## Example: Flashcards Plugin

The flashcards plugin demonstrates the plugin system capabilities:

### Types (`types.ts`)
- Defines `Flashcard` document type
- Specifies card-specific fields (front, back, etc.)
- Declares validation rules

### Repository (`repository.ts`)
- Handles flashcard-specific CRUD operations
- Implements study algorithms
- Manages card statistics and metadata

### Plugin Registration (`plugin.ts`)
- Registers flashcard document type
- Provides UI components for card viewing/editing
- Sets up data access patterns

## Creating New Plugins

To create a new plugin:

1. Create a new directory in `src/plugins/`
2. Define your document types extending base interfaces
3. Create a repository for data access
4. Implement plugin registration
5. Add UI components as needed

## Plugin Lifecycle

1. **Loading**
   - Application discovers plugins at startup
   - Plugins register their types and components
   - Database schemas are extended

2. **Runtime**
   - Plugins handle their specific document operations
   - UI components render plugin content
   - Data is persisted through repositories

3. **Cleanup**
   - Plugins can perform cleanup on shutdown
   - Data integrity is maintained
   - Resources are released properly

## Best Practices

1. **Isolation**
   - Keep plugin code self-contained
   - Use interfaces for core application interaction
   - Handle plugin-specific errors internally

2. **Performance**
   - Lazy load plugin components
   - Optimize data access patterns
   - Cache frequently used data

3. **Maintenance**
   - Document plugin interfaces clearly
   - Version plugin schemas
   - Provide migration paths for updates
