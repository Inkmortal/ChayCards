# ChayCards

An extensible flashcard and study application built with Electron, React, and TypeScript.

## Features

- Plugin-based architecture for extensibility
- SQLite database for local storage
- Spaced repetition system
- Support for text, images, and audio
- Template-based flashcard system
- Modern UI with Tailwind CSS

## Project Structure

```
src/
├── core/               # Core framework
│   ├── database/      # Database management
│   └── types/         # Base interfaces
├── plugins/           # Plugin implementations
│   └── flashcards/    # Flashcard system
├── main/              # Electron main process
├── preload/           # IPC bridge
└── renderer/          # React UI
```

## Development Setup

1. Prerequisites:

   - Node.js (LTS version recommended)
   - npm (comes with Node.js)

2. Installation:

   ```bash
   # Clone the repository
   git clone [repository-url]
   cd ChayCards

   # Install dependencies
   npm install

   # Rebuild native modules for Electron
   npm run rebuild
   ```

3. Development:

   ```bash
   # Start the development server
   npm run dev
   ```

4. Building:

   ```bash
   # Build for production
   npm run build

   # Build for specific platforms
   npm run build:win    # Windows
   npm run build:mac    # macOS
   npm run build:linux  # Linux
   ```

## Plugin Development

The application uses a plugin-based architecture for extensibility. Each plugin must implement the `DocumentTypePlugin` interface:

```typescript
interface DocumentTypePlugin<T extends BaseDocument> {
  type: string
  displayName: string
  validateDocument: (doc: T) => Promise<boolean>
  createDocument: (data: Partial<T>) => Promise<T>
  updateDocument: (id: string, data: Partial<T>) => Promise<T>
  deleteDocument: (id: string) => Promise<void>
  EditorComponent: ComponentType<{ document: T }>
  ViewerComponent: ComponentType<{ document: T }>
}
```

See the flashcards plugin implementation for a complete example.

## Database Schema

The application uses SQLite with the following core tables:

- `documents`: Base table for all document types
- `flashcards`: Flashcard-specific data
- `templates`: Flashcard templates
- `review_history`: Spaced repetition history

Migrations are automatically handled on application startup.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
