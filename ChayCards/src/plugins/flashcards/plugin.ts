/**
 * Flashcard Plugin Implementation
 *
 * Implements the DocumentTypePlugin interface for flashcards, providing:
 * - Core flashcard operations (CRUD)
 * - Integration with review system
 * - UI components for editing and reviewing
 */

import { DocumentTypePlugin } from '../../core/types/document'
import { FlashcardDocument } from './types'
import { flashcardRepository } from './repository'
import { flashcardSchema } from './schema'
import { reviewService, ReviewQuality } from './review-service'
import { FlashcardEditor } from './components/FlashcardEditor'
import { FlashcardViewer } from './components/FlashcardViewer'

/**
 * FlashcardPlugin class implements the document type plugin interface
 * for flashcard-specific functionality
 */
export class FlashcardPlugin implements DocumentTypePlugin<FlashcardDocument> {
  /** Unique identifier for flashcard document type */
  readonly type = 'flashcard'

  /** Display name for UI */
  readonly displayName = 'Flashcard'

  /** Database schema requirements for flashcard plugin */
  readonly schema = flashcardSchema

  /**
   * Validates a flashcard document
   * Ensures required fields are present and valid
   *
   * @param doc Flashcard document to validate
   * @returns Promise resolving to validation result
   */
  async validateDocument(doc: FlashcardDocument): Promise<boolean> {
    // Check required fields
    if (!doc.templateId || !doc.fields || !doc.deckId) {
      return false
    }

    // TODO: Add template-specific validation
    // This would check if all required fields are present and valid
    return true
  }

  /**
   * Creates a new flashcard
   *
   * @param data Partial flashcard data
   * @returns Promise resolving to created flashcard
   */
  async createDocument(data: Partial<FlashcardDocument>): Promise<FlashcardDocument> {
    return flashcardRepository.createFlashcard(data)
  }

  /**
   * Updates an existing flashcard
   *
   * @param id Flashcard ID
   * @param data Updated flashcard data
   * @returns Promise resolving to updated flashcard
   */
  async updateDocument(id: string, data: Partial<FlashcardDocument>): Promise<FlashcardDocument> {
    return flashcardRepository.updateFlashcard(id, data)
  }

  /**
   * Deletes a flashcard
   *
   * @param id Flashcard ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteDocument(id: string): Promise<void> {
    return flashcardRepository.deleteFlashcard(id)
  }

  /** React component for editing flashcards */
  EditorComponent = FlashcardEditor

  /** React component for reviewing flashcards */
  ViewerComponent = FlashcardViewer

  /**
   * Processes a flashcard review
   *
   * @param cardId ID of reviewed card
   * @param quality Review quality (0-5)
   * @returns Promise resolving to updated flashcard
   */
  async processReview(cardId: string, quality: ReviewQuality): Promise<FlashcardDocument> {
    return reviewService.processReview(cardId, quality)
  }

  /**
   * Retrieves due cards from a specific deck
   *
   * @param deckId Deck ID to get cards from
   * @param limit Maximum number of cards to retrieve
   * @returns Promise resolving to array of due cards
   */
  async getDueCards(deckId: string, limit: number): Promise<FlashcardDocument[]> {
    return reviewService.getDueCards(deckId, limit)
  }
}

// Export singleton instance
export const flashcardPlugin = new FlashcardPlugin()
