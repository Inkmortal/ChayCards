# ChayCards Application Architecture

## Overview
ChayCards is a modular and extensible document management application that combines the best features of Obsidian, Notion, Anki, and Quizlet. The application is built with extensibility at its core, allowing for dynamic loading of document types and plugins.

## Core Design Principles

1. **Modularity First**: Every feature is a module, making the system highly extensible
2. **Plugin-Driven Architecture**: Core functionality is minimal, with features added through plugins
3. **Document Type System**: All document types are plugins that can be dynamically loaded
4. **Inter-Plugin Communication**: Plugins can interact with each other through well-defined APIs
5. **Non-Destructive Extensions**: Plugins extend functionality without overwriting existing features

## Application Structure

```
chaycards/
├── src/                      # Source code
│   ├── main/                 # Electron main process
│   ├── renderer/             # Electron renderer process
│   ├── core/                 # Core application functionality
│   │   ├── plugin-system/    # Plugin management and loading
│   │   ├── document-system/  # Document type management
│   │   └── marketplace/      # Plugin marketplace integration
│   └── shared/              # Shared utilities and types
├── plugins/                  # Built-in and installed plugins
├── docs/                    # Documentation
└── types/                   # TypeScript type definitions
```

## Key Concepts

### Plugin System
- Plugins are self-contained modules that can:
  1. Add new document types
  2. Extend existing document types
  3. Add new functionality to the application
  4. Interact with other plugins through APIs

### Document Types
- Documents are the core content unit
- Each document type is a plugin
- Document types can be extended by other plugins
- Built-in document types include:
  - Markdown Notes
  - Notion-style Documents
  - Canvas Documents
  - Flashcard Decks

### Plugin Communication
- Plugins expose APIs for other plugins to consume
- Event system for inter-plugin communication
- Plugin dependency management
- Conflict resolution system

## For Developers

See the following guides for detailed information:
- [Plugin Development Guide](./plugin-development.md)
- [Document Type Creation Guide](./document-types.md)
- [API Reference](./api-reference.md)
- [Architecture Deep Dive](./architecture.md)
