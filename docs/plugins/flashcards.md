# Flashcards Plugin Documentation

## Overview

The flashcards plugin implements a spaced repetition flashcard system. It serves as a reference implementation demonstrating how to create full-featured plugins in ChayCards.

## Components

### Document Type (`types.ts`)

```typescript
// Example structure of a flashcard document
interface Flashcard extends BaseDocument {
  type: 'flashcard';
  front: string;         // Question/prompt side
  back: string;          // Answer side
  metadata: {
    lastReviewed?: Date;
    nextReview?: Date;
    difficulty?: number;
    streak?: number;
  }
}
```

### Repository (`repository.ts`)

The repository handles:
- CRUD operations for flashcards
- Spaced repetition algorithm implementation
- Review scheduling and statistics
- Batch operations for deck management

### Plugin Implementation (`plugin.ts`)

Responsibilities:
1. Registers flashcard document type
2. Provides UI components for:
   - Card creation/editing
   - Study interface
   - Review statistics
3. Implements study session logic
4. Manages review scheduling

## Features

1. **Card Management**
   - Create/edit flashcards
   - Organize cards into decks
   - Import/export functionality

2. **Study System**
   - Spaced repetition algorithm
   - Progress tracking
   - Performance statistics

3. **UI Components**
   - Card editor
   - Study interface
   - Statistics dashboard

## Data Flow

1. User creates/edits cards through UI
2. Plugin validates and processes input
3. Repository handles data persistence
4. Study algorithm determines review schedule
5. UI updates to reflect changes

## Extending the Plugin

The flashcards plugin can be extended by:
1. Adding new card types
2. Implementing alternative study algorithms
3. Creating additional visualization components
4. Adding import/export formats

## Integration Points

1. **Core Application**
   - Document type registration
   - Database schema extension
   - UI routing integration

2. **Other Plugins**
   - Shared data types
   - Component reuse
   - Event handling
