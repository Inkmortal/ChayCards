# Build and Deployment Architecture

## Build System Overview

ChayCards uses Electron Vite for building, providing:
- Fast HMR (Hot Module Replacement)
- TypeScript compilation
- Asset bundling
- Production optimization

### Key Configuration Files

1. **electron.vite.config.ts**
   - Vite configuration
   - Build targets
   - Plugin configuration
   - Environment variables

2. **tsconfig.json Files**
   ```typescript
   // Main process config (tsconfig.node.json)
   {
     "extends": "@electron-toolkit/tsconfig/tsconfig.node.json",
     "include": ["electron.vite.config.*", "src/main/*", "src/preload/*"],
     "compilerOptions": {
       "composite": true
     }
   }

   // Renderer process config (tsconfig.web.json)
   {
     "extends": "@electron-toolkit/tsconfig/tsconfig.web.json",
     "include": ["src/renderer/src/*"],
     "compilerOptions": {
       "jsx": "react-jsx"
     }
   }
   ```

## Build Process

1. **Development Build**
   ```bash
   # Start development server
   npm run dev
   
   # Watch mode with HMR
   npm run watch
   ```

2. **Production Build**
   ```bash
   # Create production build
   npm run build
   
   # Package application
   npm run package
   ```

### Build Outputs

- **Main Process**: Compiled Node.js backend
- **Preload Scripts**: IPC bridge scripts
- **Renderer Process**: Bundled React application
- **Resources**: Static assets and configurations

## Development Workflow

### Environment Setup

1. **Dependencies**
   - Node.js and npm
   - Development tools
   - Build dependencies

2. **Configuration**
   - Environment variables
   - Development settings
   - Debug configurations

### Development Tools

1. **Code Quality**
   ```json
   // .eslintrc.cjs
   {
     "extends": [
       "@electron-toolkit/eslint-config-ts",
       "@electron-toolkit/eslint-config-prettier"
     ]
   }
   ```

2. **Formatting**
   ```yaml
   # .prettierrc.yaml
   tabWidth: 2
   semi: false
   singleQuote: true
   ```

## Deployment Process

### Application Packaging

1. **electron-builder Configuration**
   ```yaml
   # electron-builder.yml
   appId: com.chaycards.app
   productName: ChayCards
   directories:
     output: dist
   files:
     - dist-electron/**/*
     - dist/**/*
   ```

2. **Platform Targets**
   - Windows (.exe, .msi)
   - macOS (.dmg, .pkg)
   - Linux (.deb, .rpm, AppImage)

### Release Management

1. **Version Control**
   - Semantic versioning
   - Changelog maintenance
   - Release tagging

2. **Distribution**
   - Auto-updates
   - Release channels
   - Update notifications

## Performance Optimization

### Bundle Optimization

1. **Code Splitting**
   - Route-based splitting
   - Plugin lazy loading
   - Dynamic imports

2. **Asset Optimization**
   - Image compression
   - Font subsetting
   - CSS minification

### Build Performance

1. **Cache Management**
   - Build cache
   - Dependency cache
   - TypeScript incremental builds

2. **Parallel Processing**
   - Multi-thread compilation
   - Concurrent builds
   - Resource optimization

## Development Guidelines

### Project Structure

```
ChayCards/
├── src/
│   ├── main/           # Electron main process
│   ├── preload/        # Preload scripts
│   ├── renderer/       # React application
│   ├── core/           # Core functionality
│   └── plugins/        # Plugin system
├── build/              # Build configurations
├── resources/          # Static resources
└── dist/              # Build output
```

### Best Practices

1. **Code Organization**
   - Modular architecture
   - Clear separation of concerns
   - Consistent naming conventions

2. **Build Configuration**
   - Environment-specific settings
   - Optimization rules
   - Debug configurations

3. **Deployment**
   - Automated builds
   - Testing before release
   - Version management
