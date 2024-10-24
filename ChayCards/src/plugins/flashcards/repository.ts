/**
 * Flashcard Repository Module
 *
 * Handles all database operations for flashcards including:
 * - CRUD operations
 * - Review history tracking
 * - Due card retrieval
 * - Data mapping between database and domain models
 */

import { getDatabase } from '../../core/database/service'
import { FlashcardDocument, ReviewHistory } from './types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Repository class for flashcard persistence operations
 * Implements data access patterns and mapping logic
 */
export class FlashcardRepository {
  /**
   * Base SELECT query for flashcards
   * Joins documents and flashcards tables to get complete flashcard data
   */
  private readonly SELECT_FLASHCARD = `
    SELECT
      d.id,
      d.type,
      d.title,
      d.created_at,
      d.updated_at,
      d.metadata,
      d.status,
      f.template_id,
      f.deck_id,
      f.fields,
      f.tags,
      f.interval,
      f.ease_factor,
      f.due_date,
      f.review_count,
      f.last_review_date,
      f.streak
    FROM documents d
    JOIN flashcards f ON f.id = d.id
  `

  /**
   * Creates a new flashcard in the database
   * Handles both base document and flashcard-specific data
   *
   * @param data Initial flashcard data
   * @returns Created flashcard document
   */
  async createFlashcard(data: Partial<FlashcardDocument>): Promise<FlashcardDocument> {
    const db = getDatabase()
    const now = Date.now()
    const id = uuidv4()

    return db.transaction(() => {
      try {
        // Create base document record
        db.run(
          `
          INSERT INTO documents (
            id, type, title, created_at, updated_at, metadata, status
          ) VALUES (
            @id, @type, @title, @created_at, @updated_at, @metadata, @status
          )
        `,
          {
            id,
            type: 'flashcard',
            title: data.title || 'New Flashcard',
            created_at: now,
            updated_at: now,
            metadata: JSON.stringify(data.metadata || {}),
            status: data.status || 'active'
          }
        )

        // Initialize default spaced repetition settings
        const spacedRepetition = data.spacedRepetition || {
          interval: 0,          // Initial interval (days)
          easeFactor: 2.5,      // Initial ease factor (SM-2 default)
          dueDate: new Date(),  // Due immediately
          reviewCount: 0,       // No reviews yet
          streak: 0             // No streak yet
        }

        // Format field data for storage
        const fields =
          data.fields?.map((field) => ({
            fieldId: field.fieldId,
            value: field.value
          })) || []

        // Create flashcard-specific record
        db.run(
          `
          INSERT INTO flashcards (
            id, template_id, deck_id, fields, tags,
            interval, ease_factor, due_date, review_count,
            last_review_date, streak
          ) VALUES (
            @id, @template_id, @deck_id, @fields, @tags,
            @interval, @ease_factor, @due_date, @review_count,
            @last_review_date, @streak
          )
        `,
          {
            id,
            template_id: data.templateId || 'basic',
            deck_id: data.deckId || 'default',
            fields: JSON.stringify(fields),
            tags: JSON.stringify(data.tags || []),
            interval: spacedRepetition.interval,
            ease_factor: spacedRepetition.easeFactor,
            due_date: spacedRepetition.dueDate.getTime(),
            review_count: spacedRepetition.reviewCount,
            last_review_date: spacedRepetition.lastReviewDate?.getTime(),
            streak: spacedRepetition.streak
          }
        )

        return this.getFlashcardById(id)
      } catch (error) {
        console.error('Error creating flashcard:', error)
        throw error
      }
    })
  }

  /**
   * Retrieves a flashcard by its ID
   *
   * @param id Flashcard ID
   * @returns Flashcard document
   * @throws Error if flashcard not found
   */
  async getFlashcardById(id: string): Promise<FlashcardDocument> {
    const db = getDatabase()

    const doc = db.get<DbFlashcard>(
      `
      ${this.SELECT_FLASHCARD}
      WHERE d.id = @id
    `,
      { id }
    )

    if (!doc) {
      throw new Error(`Flashcard not found: ${id}`)
    }

    return this.mapDbFlashcard(doc)
  }

  /**
   * Updates an existing flashcard
   * Handles partial updates of both document and flashcard data
   *
   * @param id Flashcard ID
   * @param data Updated flashcard data
   * @returns Updated flashcard document
   */
  async updateFlashcard(id: string, data: Partial<FlashcardDocument>): Promise<FlashcardDocument> {
    const db = getDatabase()

    return db.transaction(() => {
      try {
        // Update base document fields if provided
        if (data.title || data.metadata || data.status) {
          db.run(
            `
            UPDATE documents
            SET
              title = CASE WHEN @title IS NOT NULL THEN @title ELSE title END,
              updated_at = @updated_at,
              metadata = CASE WHEN @metadata IS NOT NULL THEN @metadata ELSE metadata END,
              status = CASE WHEN @status IS NOT NULL THEN @status ELSE status END
            WHERE id = @id
          `,
            {
              id,
              title: data.title,
              updated_at: Date.now(),
              metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
              status: data.status
            }
          )
        }

        // Update flashcard-specific fields if provided
        if (data.templateId || data.deckId || data.fields || data.tags || data.spacedRepetition) {
          const sr = data.spacedRepetition
          const fields = data.fields?.map((field) => ({
            fieldId: field.fieldId,
            value: field.value
          }))

          db.run(
            `
            UPDATE flashcards
            SET
              template_id = CASE WHEN @template_id IS NOT NULL THEN @template_id ELSE template_id END,
              deck_id = CASE WHEN @deck_id IS NOT NULL THEN @deck_id ELSE deck_id END,
              fields = CASE WHEN @fields IS NOT NULL THEN @fields ELSE fields END,
              tags = CASE WHEN @tags IS NOT NULL THEN @tags ELSE tags END,
              interval = CASE WHEN @interval IS NOT NULL THEN @interval ELSE interval END,
              ease_factor = CASE WHEN @ease_factor IS NOT NULL THEN @ease_factor ELSE ease_factor END,
              due_date = CASE WHEN @due_date IS NOT NULL THEN @due_date ELSE due_date END,
              review_count = CASE WHEN @review_count IS NOT NULL THEN @review_count ELSE review_count END,
              last_review_date = CASE WHEN @last_review_date IS NOT NULL THEN @last_review_date ELSE last_review_date END,
              streak = CASE WHEN @streak IS NOT NULL THEN @streak ELSE streak END
            WHERE id = @id
          `,
            {
              id,
              template_id: data.templateId,
              deck_id: data.deckId,
              fields: fields ? JSON.stringify(fields) : undefined,
              tags: data.tags ? JSON.stringify(data.tags) : undefined,
              interval: sr?.interval,
              ease_factor: sr?.easeFactor,
              due_date: sr?.dueDate?.getTime(),
              review_count: sr?.reviewCount,
              last_review_date: sr?.lastReviewDate?.getTime(),
              streak: sr?.streak
            }
          )
        }

        return this.getFlashcardById(id)
      } catch (error) {
        console.error('Error updating flashcard:', error)
        throw error
      }
    })
  }

  /**
   * Deletes a flashcard and its associated data
   *
   * @param id Flashcard ID
   */
  async deleteFlashcard(id: string): Promise<void> {
    const db = getDatabase()
    // Cascade delete will handle flashcard and review history
    await db.run('DELETE FROM documents WHERE id = @id', { id })
  }

  /**
   * Retrieves due cards from a specific deck
   *
   * @param deckId Deck ID
   * @param limit Maximum number of cards to retrieve
   * @returns Array of due flashcard documents
   */
  async getDueCards(deckId: string, limit: number): Promise<FlashcardDocument[]> {
    const db = getDatabase()

    const docs = db.all<DbFlashcard>(
      `
      ${this.SELECT_FLASHCARD}
      WHERE f.deck_id = @deckId
        AND f.due_date <= @now
        AND d.status = 'active'
      ORDER BY f.due_date ASC
      LIMIT @limit
    `,
      {
        deckId,
        now: Date.now(),
        limit
      }
    )

    return docs.map((doc) => this.mapDbFlashcard(doc))
  }

  /**
   * Records a review history entry
   *
   * @param review Review data to record
   * @returns Created review history entry
   */
  async addReviewHistory(review: Omit<ReviewHistory, 'id'>): Promise<ReviewHistory> {
    const db = getDatabase()
    const id = uuidv4()

    db.run(
      `
      INSERT INTO review_history (
        id, card_id, review_date, performance,
        time_spent, previous_interval, new_interval
      ) VALUES (
        @id, @card_id, @review_date, @performance,
        @time_spent, @previous_interval, @new_interval
      )
    `,
      {
        id,
        card_id: review.cardId,
        review_date: review.reviewDate.getTime(),
        performance: review.performance,
        time_spent: review.timeSpent,
        previous_interval: review.previousInterval,
        new_interval: review.newInterval
      }
    )

    return {
      id,
      ...review
    }
  }

  /**
   * Maps database flashcard record to domain model
   * Handles JSON parsing and date conversion
   *
   * @param doc Database flashcard record
   * @returns Flashcard domain model
   */
  private mapDbFlashcard(doc: DbFlashcard): FlashcardDocument {
    try {
      return {
        id: doc.id,
        type: 'flashcard',
        title: doc.title,
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at),
        metadata: JSON.parse(doc.metadata || '{}'),
        templateId: doc.template_id,
        deckId: doc.deck_id,
        fields: JSON.parse(doc.fields),
        tags: JSON.parse(doc.tags || '[]'),
        spacedRepetition: {
          interval: doc.interval,
          easeFactor: doc.ease_factor,
          dueDate: new Date(doc.due_date),
          reviewCount: doc.review_count,
          lastReviewDate: doc.last_review_date ? new Date(doc.last_review_date) : undefined,
          streak: doc.streak
        },
        status: doc.status as FlashcardDocument['status']
      }
    } catch (error) {
      console.error('Error parsing flashcard data:', error)
      console.error('Raw fields:', doc.fields)
      console.error('Raw tags:', doc.tags)
      throw error
    }
  }
}

/**
 * Database record type for flashcards
 * Represents the raw data structure from the database
 */
interface DbFlashcard {
  id: string
  type: string
  title: string
  created_at: number
  updated_at: number
  metadata: string
  template_id: string
  deck_id: string
  fields: string
  tags: string
  interval: number
  ease_factor: number
  due_date: number
  review_count: number
  last_review_date: number | null
  streak: number
  status: string
}

// Export singleton instance
export const flashcardRepository = new FlashcardRepository()
