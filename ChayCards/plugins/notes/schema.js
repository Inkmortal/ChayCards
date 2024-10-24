export const notesSchema = `
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY REFERENCES documents(id),
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0
  );
`;
