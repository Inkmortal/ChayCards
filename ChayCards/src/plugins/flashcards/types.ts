/**
 * Flashcard Domain Model Types
 *
 * This module defines the core types and interfaces for the flashcard system:
 * - Template system for card layouts
 * - Field types and validation
 * - Spaced repetition data structures
 * - Document types for cards and decks
 * - Review history tracking
 */

import { BaseDocument } from '../../core/types/document'

/**
 * Supported field types for flashcard content
 * - text: Plain text content
 * - image: Image file or URL
 * - audio: Audio file or URL
 * - maskedImage: Image with maskable regions for study
 */
export type FieldType = 'text' | 'image' | 'audio' | 'maskedImage'

/**
 * Template Field Definition
 * Defines structure and validation rules for a field in a card template
 */
export interface TemplateField {
  id: string              // Unique field identifier
  name: string           // Display name
  type: FieldType       // Content type
  required: boolean    // Whether field must have a value
  placeholder?: string // Optional placeholder text
  validationRules?: {
    minLength?: number           // Minimum content length
    maxLength?: number          // Maximum content length
    pattern?: string           // Regex validation pattern
    allowedFileTypes?: string[] // Allowed file extensions for media
  }
}

/**
 * Flashcard Template Definition
 * Defines the structure and appearance of a type of flashcard
 */
export interface FlashcardTemplate {
  id: string              // Template identifier
  name: string           // Display name
  description: string   // Template description
  fields: TemplateField[] // Field definitions
  frontHtml: string     // Front side template (supports {{field}} syntax)
  backHtml: string      // Back side template (supports {{field}} syntax)
  css?: string         // Custom styling for cards using this template
}

/**
 * Field Value
 * Represents the content of a field in a flashcard
 */
export interface FieldValue {
  fieldId: string    // References TemplateField.id
  value: string     // Content value:
                   // - For text: actual text content
                   // - For media: file path or URL
  maskData?: {     // Optional masking data for maskedImage type
    regions: {    // Masked regions in the image
      x: number
      y: number
      width: number
      height: number
    }[]
  }
}

/**
 * Spaced Repetition Data
 * Tracks learning progress using SuperMemo SM-2 algorithm
 */
export interface SpacedRepetitionData {
  interval: number       // Current interval between reviews (days)
  easeFactor: number    // Ease factor (≥ 1.3) affects interval growth
  dueDate: Date        // Next scheduled review date
  reviewCount: number  // Total number of reviews
  lastReviewDate?: Date // Last review timestamp
  streak: number      // Consecutive correct reviews
}

/**
 * Flashcard Document
 * Represents a single flashcard in the system
 * Extends BaseDocument with flashcard-specific properties
 */
export interface FlashcardDocument extends BaseDocument {
  type: 'flashcard'              // Document type discriminator
  templateId: string            // References FlashcardTemplate.id
  fields: FieldValue[]         // Card content
  tags: string[]              // Categorization tags
  spacedRepetition: SpacedRepetitionData  // Learning progress
  deckId: string             // Parent deck reference
  status: 'active' | 'suspended' | 'archived'  // Card state
}

/**
 * Deck
 * Represents a collection of flashcards
 * Supports hierarchical organization through parentDeckId
 */
export interface Deck extends BaseDocument {
  type: 'deck'           // Document type discriminator
  description?: string  // Optional deck description
  parentDeckId?: string // Parent deck for nesting
  settings?: {
    newCardsPerDay?: number   // Daily new card limit
    reviewsPerDay?: number   // Daily review limit
    learningSteps?: number[] // Custom learning intervals
  }
}

/**
 * Review History Entry
 * Records individual review sessions for analytics and scheduling
 */
export interface ReviewHistory {
  id: string           // Review entry identifier
  cardId: string      // Referenced flashcard
  reviewDate: Date   // Review timestamp
  performance: 'again' | 'hard' | 'good' | 'easy'  // Review quality
  timeSpent: number  // Review duration (milliseconds)
  previousInterval: number  // Interval before review
  newInterval: number     // Interval after review
}
