# Project Structure

```
chaycards/
├── config/                 # All configuration files
│   ├── eslint/            # ESLint configuration
│   ├── prettier/          # Prettier configuration
│   └── typescript/        # TypeScript configuration
├── src/
│   ├── main/             # Electron main process
│   │   ├── core/         # Core systems (main process)
│   │   │   ├── plugin/   # Plugin loading & management
│   │   │   ├── storage/  # File & DB operations
│   │   │   └── ipc/      # IPC handlers
│   │   ├── database/     # SQLite setup & migrations
│   │   └── window/       # Window management
│   ├── preload/          # Electron preload scripts
│   │   └── api/          # Exposed APIs to renderer
│   └── renderer/         # Electron renderer process
│       ├── components/   # React components
│       ├── hooks/        # React hooks
│       ├── pages/        # Application pages
│       └── store/        # Application state
├── plugins/              # Plugin directory
│   └── README.md        # Plugin installation guide
└── docs/                # Documentation

# Application Data (outside project directory)
%APPDATA%/ChayCards/
├── data/                # Application data
│   ├── documents/       # Document storage
│   │   ├── markdown/   # Markdown documents
│   │   ├── flashcards/ # Flashcard documents
│   │   └── canvas/     # Canvas documents
│   ├── metadata.db     # SQLite database
│   └── indexes/        # Search indexes
└── plugins/            # Installed plugins
```

## Process Architecture

### Main Process (Node.js)
- File system operations
- SQLite database management
- Plugin loading & validation
- Window management
- IPC handling

### Preload Scripts
- Secure bridge between main and renderer
- Exposed APIs for renderer
- IPC communication setup

### Renderer Process (React)
- User interface
- Document rendering
- Plugin UI integration
- State management

## Core Systems

### Plugin System
- Plugin discovery & loading in main process
- Plugin validation & security checks
- IPC bridge for plugin APIs
- UI integration in renderer

### Storage System
- Direct file system access through main process
- SQLite for metadata and search
- Efficient binary data handling
- Automatic backups

### Document System
- Document type registration
- File-based storage
- Version control
- Search indexing

### Event System
- IPC-based communication
- Plugin event handling
- State synchronization
- Error handling

## Development Stack

- **Backend**: Node.js (Electron main process)
- **Frontend**: React (Electron renderer process)
- **Database**: SQLite (better-sqlite3)
- **Build**: Electron Builder
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier

## Key Features

1. **Native Integration**
   - Full file system access
   - Native dialogs
   - System notifications
   - Custom file associations

2. **Performance**
   - Native SQLite performance
   - Efficient IPC communication
   - Optimized file handling
   - Background processing

3. **Security**
   - Process isolation
   - Secure IPC
   - Plugin sandboxing
   - File system permissions
