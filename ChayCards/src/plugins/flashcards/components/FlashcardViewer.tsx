/**
 * Flashcard Viewer Component
 *
 * React component for reviewing flashcards:
 * - Front/back card display
 * - Review controls
 * - Performance rating
 */

import React, { useState } from 'react'
import { FlashcardDocument } from '../types'
import { ReviewQuality } from '../review-service'

export interface FlashcardViewerProps {
  document: FlashcardDocument
  onReview?: (quality: ReviewQuality) => void
  onNext?: () => void
}

/**
 * Viewer component for flashcards
 * Handles display and review of flashcard content
 */
export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  document,
  onReview,
  onNext
}) => {
  const [showAnswer, setShowAnswer] = useState(false)

  /**
   * Handles review rating selection
   * @param quality Review quality rating (0-5)
   */
  const handleReview = (quality: ReviewQuality) => {
    if (onReview) {
      onReview(quality)
    }
    setShowAnswer(false)
    if (onNext) {
      onNext()
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Card Content */}
      <div className="mb-8 p-6 border rounded-lg shadow-md min-h-[200px]">
        {showAnswer ? (
          <div>
            {/* Front side */}
            <div className="mb-4 pb-4 border-b">
              <div
                dangerouslySetInnerHTML={{
                  __html: document.templateId // TODO: Render actual front template with fields
                }}
              />
            </div>
            {/* Back side */}
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: document.templateId // TODO: Render actual back template with fields
                }}
              />
            </div>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: document.templateId // TODO: Render actual front template with fields
            }}
          />
        )}
      </div>

      {/* Review Controls */}
      <div className="flex justify-center gap-2">
        {!showAnswer ? (
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleReview(1)}
            >
              Again
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => handleReview(2)}
            >
              Hard
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleReview(4)}
            >
              Good
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleReview(5)}
            >
              Easy
            </button>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        <span className="mr-4">Streak: {document.spacedRepetition.streak}</span>
        <span>Interval: {document.spacedRepetition.interval} days</span>
      </div>
    </div>
  )
}
