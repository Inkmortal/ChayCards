# ChayCards Application Documentation

## Application Architecture

ChayCards is an Electron-based application using React for the frontend. The application follows a plugin-based architecture that allows for extensibility.

### Key Components

1. **Core Layer** (`src/core/`)
   - Contains the fundamental database and type definitions
   - Handles base document types and database schema management
   - Provides services for data persistence

2. **Plugin System** (`src/plugins/`)
   - Allows extending the application with new document types and views
   - Each plugin can define its own:
     - Document types and schemas
     - UI components and views
     - Business logic and data handling
   - Example: Flashcards plugin implements flashcard-specific functionality

3. **Main Process** (`src/main/`)
   - Electron main process code
   - Handles database initialization and management
   - Manages IPC communication between renderer and main processes

4. **Renderer Process** (`src/renderer/`)
   - React-based UI implementation
   - Handles user interface and interactions
   - Communicates with main process via IPC

5. **Preload** (`src/preload/`)
   - Provides secure bridge between renderer and main processes
   - Exposes specific main process functionality to renderer

## Directory Structure

```
src/
├── core/               # Core application functionality
│   ├── database/      # Database schema and services
│   └── types/         # Base type definitions
├── plugins/           # Plugin implementations
│   └── flashcards/    # Flashcard plugin example
├── main/              # Electron main process
├── renderer/          # React UI implementation
└── preload/           # Electron preload scripts
```

## Plugin System

The plugin system allows for extending the application with new document types and functionality:

1. Each plugin can define its own document types and schemas
2. Plugins register their document types with the core database service
3. The application dynamically loads plugin UI components and handlers
4. New plugins can be added without modifying core application code

## Database Architecture

The database system uses a flexible schema approach:

1. Core schema defines base document structure
2. Plugins can extend the schema for their specific document types
3. Document types are registered at runtime
4. Each plugin manages its own data access through repositories

More detailed documentation for each component can be found in the respective subdirectories.
