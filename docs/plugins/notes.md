# Notes Plugin Documentation

## Overview

The Notes plugin provides a simple and elegant way to create, edit, and manage markdown-formatted notes within the application. It features a clean interface for note editing and viewing, with automatic saving and a responsive grid layout for the note list.

## Features

- Create and edit notes with markdown support
- Real-time saving
- Clean and aesthetic note list view
- Dark mode support
- Keyboard shortcuts (Ctrl+S to save)
- Word count tracking

## File Structure

```
src/plugins/notes/
├── components/           # UI Components
│   ├── NoteEditor.tsx   # Note editing interface
│   └── NoteList.tsx     # Notes grid view
├── plugin.ts            # Main plugin implementation
├── repository.ts        # Database operations
├── schema.ts           # Database schema definition
└── types.ts            # Type definitions
```

## Database Schema

### Notes Table
```sql
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY REFERENCES documents(id),
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0
);
```

## Usage

### Creating a Note
```typescript
const note = await notesPlugin.createDocument({
  title: 'My First Note',
  content: '# Hello World\n\nThis is my first note!'
});
```

### Updating a Note
```typescript
await notesPlugin.updateDocument(noteId, {
  title: 'Updated Title',
  content: 'Updated content'
});
```

### Getting All Notes
```typescript
const notes = await notesPlugin.getAllDocuments();
```

## Components

### NoteEditor
A full-screen editor component that provides:
- Title editing
- Content editing
- Auto-save functionality
- Back navigation
- Save button with loading state

### NoteList
A responsive grid layout that displays:
- Note titles
- Content previews
- Last edited timestamps
- New note creation button
