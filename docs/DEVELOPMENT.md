# Development Workflow

## Quick Start

```bash
# Development
npm run dev     # Start development environment with hot reloading

# Production
npm run build   # Build application and create executable
```

## Overview

ChayCards uses Vite with its electron plugin for a streamlined development experience:

```
┌─────────────────────────────────────────────┐
│              Development Flow               │
├─────────────┬───────────────┬──────────────┤
│  Main       │   Renderer    │   Plugins    │
│  Process    │   Process     │   System     │
├─────────────┼───────────────┼──────────────┤
│  Hot        │   Hot Module  │   Plugin     │
│  Reload     │   Replacement │   Loading    │
└─────────────┴───────────────┴──────────────┘
```

## Core Application Structure

```
┌─────────────────────────────────────────────┐
│              Application Flow               │
├─────────────┬───────────────┬──────────────┤
│  Navigation │    Library    │    Plugins   │
│  System     │    Page       │    Page      │
├─────────────┼───────────────┼──────────────┤
│  HashRouter │  Documents &  │   Plugin     │
│  Routes     │   Folders     │  Management  │
└─────────────┴───────────────┴──────────────┘
```

## Directory Structure

```
chaycards/
├── src/
│   ├── main/             # Electron main process
│   │   └── index.ts      # Main entry point
│   ├── preload/          # Preload scripts
│   │   └── index.ts      # Preload entry point
│   └── renderer/         # React application
│       ├── components/   # React components
│       │   └── Navigation.tsx  # Main navigation
│       ├── pages/        # Page components
│       │   ├── Library.tsx    # Document management
│       │   └── Plugins.tsx    # Plugin management
│       ├── App.tsx       # Root component
│       └── index.tsx     # Renderer entry point
└── plugins/             # Plugin system
    ├── src/            # Plugin source code
    │   └── example/    # Example plugin
    └── test/           # Plugin tests
```

## Development Features

- Hot Module Replacement (HMR) for React components
- Automatic reloading of main process
- Plugin hot reloading
- TypeScript support throughout
- React Router with HashRouter for navigation

## Core Features

### Library Page
- Document and folder management
- Create new folders
- Create documents with type selection
- Organized document/folder view

### Plugins Page
- Enable/disable document types
- View installed plugins
- Manage feature plugins
- Plugin status monitoring

## Building

### Development
```bash
npm run dev
```
- Starts development environment
- Enables hot reloading
- Opens DevTools automatically
- Watches for file changes

### Production
```bash
npm run build
```
- Builds the application
- Creates executable in release/win-unpacked/
- Packages all resources and plugins
- Creates distributable version

## Plugin Development

### Creating a Plugin
1. Create new directory in plugins/src/
2. Use example plugin as template
3. Test using `npm run test:plugins`

### Plugin Types
1. Document Types
   - Define document structure
   - Provide editing interface
   - Handle document operations

2. Feature Plugins
   - Add new functionality
   - Extend existing features
   - Provide services

## Best Practices

### Development
- Make changes and see immediate updates
- Use DevTools for debugging
- Keep plugins independent
- Test changes before building
- Use TypeScript for type safety
- Follow component structure guidelines

### Component Guidelines
1. Use functional components
2. Implement proper routing
3. Handle state appropriately
4. Document props and interfaces
5. Follow consistent styling

### Common Issues

1. Build Issues
   - Clear dist directory
   - Check TypeScript errors
   - Verify all files built

2. Plugin Development
   - Ensure correct TypeScript setup
   - Run tests before building

3. Navigation Issues
   - Check route definitions
   - Verify HashRouter setup
   - Confirm component mounting
