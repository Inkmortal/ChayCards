/**
 * Main Application Component
 *
 * Provides the primary user interface for the flashcard system:
 * - Card management (create, review, delete)
 * - Card list display
 * - Loading and error states
 * - IPC communication with main process
 */

import { useState, useEffect } from 'react'
import { FlashcardDocument } from '../../plugins/flashcards/types'

function App(): JSX.Element {
  // Application state
  const [cards, setCards] = useState<FlashcardDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Initial data loading effect
   * Fetches due cards when component mounts
   */
  useEffect(() => {
    const loadCards = async (): Promise<void> => {
      try {
        // Fetch cards due for review from test deck
        const dueCards = await window.electron.flashcards.getDue('test-deck', 10)
        setCards(dueCards)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards')
      } finally {
        setLoading(false)
      }
    }

    void loadCards()
  }, [])

  /**
   * Creates a test flashcard
   * Demonstrates card creation through IPC bridge
   */
  const handleCreateTestCard = async (): Promise<void> => {
    try {
      const newCard = await window.electron.flashcards.create({
        title: 'Test Card',
        templateId: 'basic',
        deckId: 'test-deck',
        fields: [
          {
            fieldId: 'front',
            value: 'What is the capital of France?'
          },
          {
            fieldId: 'back',
            value: 'Paris'
          }
        ],
        tags: ['test', 'geography'],
        // Initialize spaced repetition data
        spacedRepetition: {
          interval: 0,          // Start with 0-day interval
          easeFactor: 2.5,      // Default ease factor
          dueDate: new Date(),  // Due immediately
          reviewCount: 0,       // No reviews yet
          streak: 0             // No streak yet
        }
      })

      // Add new card to state
      setCards((prev) => [...prev, newCard])
    } catch (err) {
      console.error('Failed to create card:', err)
      setError(err instanceof Error ? err.message : 'Failed to create card')
    }
  }

  /**
   * Processes a card review
   * Updates card's spaced repetition data based on performance
   *
   * @param cardId ID of reviewed card
   * @param quality Review quality (0-5)
   */
  const handleReviewCard = async (cardId: string, quality: number): Promise<void> => {
    try {
      const updatedCard = await window.electron.flashcards.review(
        cardId,
        quality as 0 | 1 | 2 | 3 | 4 | 5
      )

      // Update card in state
      setCards((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    } catch (err) {
      console.error('Failed to review card:', err)
      setError(err instanceof Error ? err.message : 'Failed to review card')
    }
  }

  /**
   * Deletes a flashcard
   *
   * @param cardId ID of card to delete
   */
  const handleDeleteCard = async (cardId: string): Promise<void> => {
    try {
      await window.electron.flashcards.delete(cardId)
      // Remove card from state
      setCards((prev) => prev.filter((card) => card.id !== cardId))
    } catch (err) {
      console.error('Failed to delete card:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete card')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  // Main UI
  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900">ChayCards</h1>
          <p className="mt-2 text-secondary-600">Your personal flashcard study system</p>
        </header>

        {/* Card Creation */}
        <div className="mb-8">
          <button onClick={() => void handleCreateTestCard()} className="btn-primary">
            Create Test Card
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="card">
              {/* Card Title */}
              <h3 className="mb-4 text-xl font-semibold">{card.title}</h3>

              {/* Front Content */}
              <div className="mb-4">
                <div className="text-sm text-secondary-500">Front:</div>
                <div className="mt-1">{card.fields.find((f) => f.fieldId === 'front')?.value}</div>
              </div>

              {/* Back Content */}
              <div>
                <div className="text-sm text-secondary-500">Back:</div>
                <div className="mt-1">{card.fields.find((f) => f.fieldId === 'back')?.value}</div>
              </div>

              {/* Review Statistics */}
              <div className="mt-4">
                <div className="text-sm text-secondary-500">Review Info:</div>
                <div className="mt-1 text-sm">
                  <div>Interval: {card.spacedRepetition.interval} days</div>
                  <div>Reviews: {card.spacedRepetition.reviewCount}</div>
                  <div>Streak: {card.spacedRepetition.streak}</div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => void handleReviewCard(card.id, 3)} className="btn-secondary">
                  Review
                </button>
                <button
                  onClick={() => void handleDeleteCard(card.id)}
                  className="btn bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {cards.length === 0 && (
          <div className="mt-8 text-center text-secondary-600">
            No cards available. Create some cards to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default App
