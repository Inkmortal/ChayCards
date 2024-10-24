import { useState, useEffect } from 'react';
import { FlashcardDocument } from '../../plugins/flashcards/types';

function App(): JSX.Element {
  const [cards, setCards] = useState<FlashcardDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test loading some cards
    const loadCards = async (): Promise<void> => {
      try {
        // For testing, we'll use a placeholder deck ID
        const dueCards = await window.electron.flashcards.getDue('test-deck', 10);
        setCards(dueCards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      } finally {
        setLoading(false);
      }
    };

    void loadCards();
  }, []);

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
        spacedRepetition: {
          interval: 0,
          easeFactor: 2.5,
          dueDate: new Date(),
          reviewCount: 0,
          streak: 0
        }
      });

      setCards(prev => [...prev, newCard]);
    } catch (err) {
      console.error('Failed to create card:', err);
      setError(err instanceof Error ? err.message : 'Failed to create card');
    }
  };

  const handleReviewCard = async (cardId: string, quality: number): Promise<void> => {
    try {
      const updatedCard = await window.electron.flashcards.review(
        cardId,
        quality as 0 | 1 | 2 | 3 | 4 | 5
      );

      setCards(prev =>
        prev.map(card => (card.id === updatedCard.id ? updatedCard : card))
      );
    } catch (err) {
      console.error('Failed to review card:', err);
      setError(err instanceof Error ? err.message : 'Failed to review card');
    }
  };

  const handleDeleteCard = async (cardId: string): Promise<void> => {
    try {
      await window.electron.flashcards.delete(cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
    } catch (err) {
      console.error('Failed to delete card:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900">ChayCards</h1>
          <p className="mt-2 text-secondary-600">Your personal flashcard study system</p>
        </header>

        <div className="mb-8">
          <button
            onClick={() => void handleCreateTestCard()}
            className="btn-primary"
          >
            Create Test Card
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(card => (
            <div key={card.id} className="card">
              <h3 className="mb-4 text-xl font-semibold">{card.title}</h3>
              <div className="mb-4">
                <div className="text-sm text-secondary-500">Front:</div>
                <div className="mt-1">
                  {card.fields.find(f => f.fieldId === 'front')?.value}
                </div>
              </div>
              <div>
                <div className="text-sm text-secondary-500">Back:</div>
                <div className="mt-1">
                  {card.fields.find(f => f.fieldId === 'back')?.value}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-secondary-500">Review Info:</div>
                <div className="mt-1 text-sm">
                  <div>Interval: {card.spacedRepetition.interval} days</div>
                  <div>Reviews: {card.spacedRepetition.reviewCount}</div>
                  <div>Streak: {card.spacedRepetition.streak}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => void handleReviewCard(card.id, 3)}
                  className="btn-secondary"
                >
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

        {cards.length === 0 && (
          <div className="mt-8 text-center text-secondary-600">
            No cards available. Create some cards to get started!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
