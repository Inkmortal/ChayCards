import { type ComponentType } from 'react';
import { DocumentTypePlugin } from '../../core/types/document';
import { FlashcardDocument, type FieldValue } from './types';
import { flashcardRepository } from './repository';

/**
 * Flashcard plugin implementation
 */
export class FlashcardPlugin implements DocumentTypePlugin<FlashcardDocument> {
  readonly type = 'flashcard';
  readonly displayName = 'Flashcard';

  async validateDocument(doc: FlashcardDocument): Promise<boolean> {
    // Basic validation
    if (!doc.templateId || !doc.fields || !doc.deckId) {
      return false;
    }

    // TODO: Add template-specific validation
    // This would check if all required fields are present and valid
    return true;
  }

  async createDocument(data: Partial<FlashcardDocument>): Promise<FlashcardDocument> {
    return flashcardRepository.createFlashcard(data);
  }

  async updateDocument(id: string, data: Partial<FlashcardDocument>): Promise<FlashcardDocument> {
    return flashcardRepository.updateFlashcard(id, data);
  }

  async deleteDocument(id: string): Promise<void> {
    return flashcardRepository.deleteFlashcard(id);
  }

  // Placeholder components - these will be implemented separately
  EditorComponent: ComponentType<{ document: FlashcardDocument }> = () => {
    return null; // Will be implemented in a separate UI component file
  };

  ViewerComponent: ComponentType<{ document: FlashcardDocument }> = () => {
    return null; // Will be implemented in a separate UI component file
  };

  // Helper methods for flashcard-specific operations
  async processReview(
    cardId: string,
    quality: 0 | 1 | 2 | 3 | 4 | 5
  ): Promise<FlashcardDocument> {
    const card = await flashcardRepository.getFlashcardById(cardId);
    const previousInterval = card.spacedRepetition.interval;

    // Calculate new spaced repetition data
    const newSpacedRepetitionData = {
      ...card.spacedRepetition,
      interval: quality >= 3 ? previousInterval * card.spacedRepetition.easeFactor : 1,
      easeFactor: Math.max(
        1.3,
        card.spacedRepetition.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      ),
      reviewCount: card.spacedRepetition.reviewCount + 1,
      lastReviewDate: new Date(),
      streak: quality >= 3 ? card.spacedRepetition.streak + 1 : 0
    };

    // Update due date based on new interval
    newSpacedRepetitionData.dueDate = new Date();
    newSpacedRepetitionData.dueDate.setDate(
      newSpacedRepetitionData.dueDate.getDate() + newSpacedRepetitionData.interval
    );

    // Record review history
    await flashcardRepository.addReviewHistory({
      cardId,
      reviewDate: new Date(),
      performance: quality >= 4 ? 'easy' : quality >= 3 ? 'good' : quality >= 2 ? 'hard' : 'again',
      timeSpent: 0, // TODO: Track actual review time
      previousInterval,
      newInterval: newSpacedRepetitionData.interval
    });

    // Update card with new spaced repetition data
    return flashcardRepository.updateFlashcard(cardId, {
      spacedRepetition: newSpacedRepetitionData
    });
  }

  async getDueCards(deckId: string, limit: number): Promise<FlashcardDocument[]> {
    return flashcardRepository.getDueCards(deckId, limit);
  }

  async validateFieldValue(fieldValue: FieldValue): Promise<boolean> {
    // TODO: Implement field validation based on template rules
    console.log('Validating field value:', fieldValue);
    return true;
  }
}

// Export plugin instance
export const flashcardPlugin = new FlashcardPlugin();
