/**
 * Flashcard Review Service
 *
 * Implements the SuperMemo SM-2 spaced repetition algorithm
 * and handles review-related operations:
 * - Review processing
 * - Interval calculations
 * - Performance tracking
 */

import { FlashcardDocument } from './types'
import { flashcardRepository } from './repository'

/**
 * Review quality ratings according to SM-2 algorithm
 */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Review performance categories
 */
export type ReviewPerformance = 'again' | 'hard' | 'good' | 'easy'

/**
 * Review Service class handles spaced repetition logic
 */
export class ReviewService {
  /**
   * Processes a flashcard review using the SuperMemo SM-2 algorithm
   *
   * Quality ratings:
   * 0 - Complete blackout
   * 1 - Incorrect response; the correct one remembered
   * 2 - Incorrect response; where the correct one seemed easy to recall
   * 3 - Correct response recalled with serious difficulty
   * 4 - Correct response after a hesitation
   * 5 - Perfect response
   *
   * @param cardId ID of reviewed card
   * @param quality Review quality (0-5)
   * @returns Promise resolving to updated flashcard
   */
  async processReview(cardId: string, quality: ReviewQuality): Promise<FlashcardDocument> {
    const card = await flashcardRepository.getFlashcardById(cardId)
    const previousInterval = card.spacedRepetition.interval

    // Calculate new spaced repetition data
    const newSpacedRepetitionData = this.calculateNewSpacedRepetitionData(
      card.spacedRepetition,
      quality
    )

    // Record review in history
    await flashcardRepository.addReviewHistory({
      cardId,
      reviewDate: new Date(),
      performance: this.qualityToPerformance(quality),
      timeSpent: 0, // TODO: Track actual review time
      previousInterval,
      newInterval: newSpacedRepetitionData.interval
    })

    // Update card with new spaced repetition data
    return flashcardRepository.updateFlashcard(cardId, {
      spacedRepetition: newSpacedRepetitionData
    })
  }

  /**
   * Calculates new spaced repetition data based on review quality
   * Implements SuperMemo SM-2 algorithm
   *
   * @param currentData Current spaced repetition data
   * @param quality Review quality (0-5)
   * @returns Updated spaced repetition data
   */
  private calculateNewSpacedRepetitionData(
    currentData: FlashcardDocument['spacedRepetition'],
    quality: ReviewQuality
  ): FlashcardDocument['spacedRepetition'] {
    const newData = {
      ...currentData,
      // If quality >= 3 (correct response), increase interval by ease factor
      // Otherwise, reset to 1 day
      interval: quality >= 3 ? currentData.interval * currentData.easeFactor : 1,

      // Adjust ease factor based on performance
      // Minimum ease factor is 1.3
      easeFactor: Math.max(
        1.3,
        currentData.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      ),

      reviewCount: currentData.reviewCount + 1,
      lastReviewDate: new Date(),
      // Increment streak for correct answers, reset for incorrect
      streak: quality >= 3 ? currentData.streak + 1 : 0
    }

    // Calculate next due date based on new interval
    newData.dueDate = new Date()
    newData.dueDate.setDate(newData.dueDate.getDate() + newData.interval)

    return newData
  }

  /**
   * Converts numerical quality rating to performance category
   *
   * @param quality Review quality (0-5)
   * @returns Performance category
   */
  private qualityToPerformance(quality: ReviewQuality): ReviewPerformance {
    if (quality >= 4) return 'easy'
    if (quality >= 3) return 'good'
    if (quality >= 2) return 'hard'
    return 'again'
  }

  /**
   * Retrieves due cards from a specific deck
   *
   * @param deckId Deck ID to get cards from
   * @param limit Maximum number of cards to retrieve
   * @returns Promise resolving to array of due cards
   */
  async getDueCards(deckId: string, limit: number): Promise<FlashcardDocument[]> {
    return flashcardRepository.getDueCards(deckId, limit)
  }
}

// Export singleton instance
export const reviewService = new ReviewService()
