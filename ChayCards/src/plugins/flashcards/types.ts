import { BaseDocument } from '../../core/types/document';

/**
 * Supported field types for flashcard templates
 */
export type FieldType = 'text' | 'image' | 'audio' | 'maskedImage';

/**
 * Template field definition
 */
export interface TemplateField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    allowedFileTypes?: string[];
  };
}

/**
 * Template definition for flashcards
 */
export interface FlashcardTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  frontHtml: string; // HTML template for front of card
  backHtml: string;  // HTML template for back of card
  css?: string;      // Custom CSS for this template
}

/**
 * Field value for a flashcard
 */
export interface FieldValue {
  fieldId: string;
  value: string;     // For text fields: text content
                     // For media fields: file path or URL
  maskData?: {       // For masked images
    regions: {
      x: number;
      y: number;
      width: number;
      height: number;
    }[];
  };
}

/**
 * Spaced repetition data for a flashcard
 */
export interface SpacedRepetitionData {
  interval: number;          // Current interval in days
  easeFactor: number;        // Current ease factor
  dueDate: Date;            // Next review date
  reviewCount: number;       // Total number of reviews
  lastReviewDate?: Date;     // Date of last review
  streak: number;           // Current streak of correct answers
}

/**
 * Flashcard document type
 */
export interface FlashcardDocument extends BaseDocument {
  type: 'flashcard';
  templateId: string;
  fields: FieldValue[];
  tags: string[];
  spacedRepetition: SpacedRepetitionData;
  deckId: string;           // ID of the deck this card belongs to
  status: 'active' | 'suspended' | 'archived';
}

/**
 * Deck for organizing flashcards
 */
export interface Deck extends BaseDocument {
  type: 'deck';
  description?: string;
  parentDeckId?: string;    // For nested decks
  settings?: {
    newCardsPerDay?: number;
    reviewsPerDay?: number;
    learningSteps?: number[];
  };
}

/**
 * Review history entry
 */
export interface ReviewHistory {
  id: string;
  cardId: string;
  reviewDate: Date;
  performance: 'again' | 'hard' | 'good' | 'easy';
  timeSpent: number;        // Time spent in milliseconds
  previousInterval: number;
  newInterval: number;
}
