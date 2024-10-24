export const coreSchema = `
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    metadata TEXT
  );
`;
