/**
 * Flashcard Plugin Schema Definition
 *
 * Defines the database schema requirements for the flashcard plugin:
 * - Tables structure
 * - Indexes
 * - Initial data
 */

import { PluginSchema } from '../../core/types/document'

/**
 * Database schema for flashcard plugin
 */
export const flashcardSchema: PluginSchema = {
  tables: [
    `CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
      template_id TEXT NOT NULL,     -- Reference to card template
      deck_id TEXT NOT NULL,         -- Parent deck ID
      fields TEXT NOT NULL,          -- JSON array of field values
      tags TEXT,                     -- JSON array of tags
      interval INTEGER NOT NULL DEFAULT 0,      -- Current interval in days
      ease_factor REAL NOT NULL DEFAULT 2.5,    -- SM-2 ease factor
      due_date INTEGER NOT NULL,               -- Next review date
      review_count INTEGER NOT NULL DEFAULT 0,  -- Total reviews
      last_review_date INTEGER,                -- Last review timestamp
      streak INTEGER NOT NULL DEFAULT 0         -- Current streak
    )`,
    `CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
      description TEXT,              -- Deck description
      parent_deck_id TEXT REFERENCES decks(id) ON DELETE SET NULL,  -- Parent deck for nesting
      settings TEXT                  -- JSON object for deck settings
    )`,
    `CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,           -- Template ID
      name TEXT NOT NULL,            -- Template name
      description TEXT,              -- Template description
      fields TEXT NOT NULL,          -- JSON array of field definitions
      front_html TEXT NOT NULL,      -- Front side template
      back_html TEXT NOT NULL,       -- Back side template
      css TEXT,                      -- Custom CSS styles
      created_at INTEGER NOT NULL,   -- Creation timestamp
      updated_at INTEGER NOT NULL    -- Last update timestamp
    )`,
    `CREATE TABLE IF NOT EXISTS review_history (
      id TEXT PRIMARY KEY,           -- Review ID
      card_id TEXT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
      review_date INTEGER NOT NULL,  -- Review timestamp
      performance TEXT NOT NULL,     -- Review performance rating
      time_spent INTEGER NOT NULL,   -- Time spent on review (ms)
      previous_interval INTEGER NOT NULL,  -- Previous interval
      new_interval INTEGER NOT NULL       -- New interval after review
    )`
  ],
  indexes: [
    'CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON flashcards(deck_id)',
    'CREATE INDEX IF NOT EXISTS idx_flashcards_due ON flashcards(due_date)',
    'CREATE INDEX IF NOT EXISTS idx_decks_parent ON decks(parent_deck_id)',
    'CREATE INDEX IF NOT EXISTS idx_review_history_card ON review_history(card_id)'
  ],
  initialData: [
    `INSERT OR IGNORE INTO templates (
      id, name, description, fields, front_html, back_html, created_at, updated_at
    ) VALUES (
      'basic',
      'Basic',
      'A basic two-sided flashcard',
      '[{"id":"front","name":"Front","type":"text","required":true},{"id":"back","name":"Back","type":"text","required":true}]',
      '<div class="text-lg">{{front}}</div>',
      '<div class="text-lg">{{back}}</div>',
      strftime('%s', 'now') * 1000,
      strftime('%s', 'now') * 1000
    )`,
    `INSERT OR IGNORE INTO documents (
      id, type, title, created_at, updated_at, status
    ) VALUES (
      'default',
      'deck',
      'Default Deck',
      strftime('%s', 'now') * 1000,
      strftime('%s', 'now') * 1000,
      'active'
    )`,
    `INSERT OR IGNORE INTO decks (
      id, description, settings
    ) VALUES (
      'default',
      'Default deck for new cards',
      '{"newCardsPerDay":20,"reviewsPerDay":200}'
    )`
  ]
}
