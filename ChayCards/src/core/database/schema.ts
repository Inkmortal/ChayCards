/**
 * Database schema definitions and migrations
 */
export const SCHEMA_VERSION = 1;

export const MIGRATIONS = {
  1: `
    -- Create documents table for all document types
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      metadata TEXT,
      status TEXT NOT NULL DEFAULT 'active'
    );

    -- Create flashcards table
    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
      template_id TEXT NOT NULL,
      deck_id TEXT NOT NULL,
      fields TEXT NOT NULL, -- JSON array of field values
      tags TEXT, -- JSON array of tags
      interval INTEGER NOT NULL DEFAULT 0,
      ease_factor REAL NOT NULL DEFAULT 2.5,
      due_date INTEGER NOT NULL,
      review_count INTEGER NOT NULL DEFAULT 0,
      last_review_date INTEGER,
      streak INTEGER NOT NULL DEFAULT 0
    );

    -- Create decks table
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
      description TEXT,
      parent_deck_id TEXT REFERENCES decks(id) ON DELETE SET NULL,
      settings TEXT -- JSON object for deck settings
    );

    -- Create templates table
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      fields TEXT NOT NULL, -- JSON array of field definitions
      front_html TEXT NOT NULL,
      back_html TEXT NOT NULL,
      css TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Create review_history table
    CREATE TABLE IF NOT EXISTS review_history (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
      review_date INTEGER NOT NULL,
      performance TEXT NOT NULL,
      time_spent INTEGER NOT NULL,
      previous_interval INTEGER NOT NULL,
      new_interval INTEGER NOT NULL
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
    CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON flashcards(deck_id);
    CREATE INDEX IF NOT EXISTS idx_flashcards_due ON flashcards(due_date);
    CREATE INDEX IF NOT EXISTS idx_decks_parent ON decks(parent_deck_id);
    CREATE INDEX IF NOT EXISTS idx_review_history_card ON review_history(card_id);

    -- Insert default template
    INSERT OR IGNORE INTO templates (
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
    );

    -- Insert default deck
    INSERT OR IGNORE INTO documents (
      id, type, title, created_at, updated_at, status
    ) VALUES (
      'default',
      'deck',
      'Default Deck',
      strftime('%s', 'now') * 1000,
      strftime('%s', 'now') * 1000,
      'active'
    );

    INSERT OR IGNORE INTO decks (
      id, description, settings
    ) VALUES (
      'default',
      'Default deck for new cards',
      '{"newCardsPerDay":20,"reviewsPerDay":200}'
    );
  `
};

/**
 * Utility type for table names
 */
export type TableName =
  | 'documents'
  | 'flashcards'
  | 'decks'
  | 'templates'
  | 'review_history';

/**
 * Database configuration
 */
export interface DatabaseConfig {
  filename: string;
  verbose?: boolean;
}

/**
 * Schema version information stored in the database
 */
export interface SchemaVersion {
  version: number;
  updated_at: number;
}
