# ChayCards Documentation

## Overview

ChayCards is a flexible document management system built with Electron, React, and TypeScript. It provides a plugin-based architecture that allows for different types of documents (notes, flashcards, etc.) to be managed within a single application.

## Core Features

- Plugin-based architecture for extensible document types
- Unified document management interface
- Dark mode support
- SQLite database for persistent storage
- Type-safe IPC communication

## Project Structure

```
ChayCards/
├── src/
│   ├── core/               # Core system functionality
│   │   ├── database/       # Database services
│   │   └── types/         # Core type definitions
│   ├── plugins/           # Plugin implementations
│   │   └── notes/         # Notes plugin
│   ├── main/             # Electron main process
│   ├── preload/          # Preload scripts for IPC
│   └── renderer/         # React frontend
└── docs/                 # Documentation
```

## Plugin System

The application uses a plugin-based architecture where each document type is implemented as a plugin. Plugins provide:

- Document type definition
- Database schema
- UI components for editing and viewing
- Business logic for document operations

### Creating a Plugin

To create a new plugin:

1. Implement the `DocumentTypePlugin` interface
2. Define document type and schema
3. Create UI components
4. Register the plugin with the system

Example:
```typescript
export class YourPlugin implements DocumentTypePlugin<YourDocument> {
  type = 'your-type';
  displayName = 'Your Plugin';
  
  // Implement required methods and components
}
```

## IPC Communication

The application uses a secure IPC system for communication between the main and renderer processes:

- `get-plugins`: Retrieves all registered plugins
- `get-plugin`: Gets a specific plugin by type
- `get-all-documents`: Retrieves all documents across all plugins
- `save-document`: Creates or updates a document

## User Interface

The main interface provides:

- Document list sorted by last modified date
- Create new document buttons for each plugin type
- Document type-specific editors and viewers
- Dark mode support

## Development

### Prerequisites

- Node.js 16+
- npm or yarn
- TypeScript knowledge
- Electron/React experience

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development: `npm run dev`
4. Build: `npm run build`

### Adding a New Plugin

1. Create a new directory in `src/plugins/`
2. Implement the required interfaces
3. Create UI components
4. Register the plugin in `main/index.ts`

## Best Practices

- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Add documentation for new features
- Write clean, maintainable code
