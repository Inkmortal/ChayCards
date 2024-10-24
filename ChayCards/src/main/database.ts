import { app } from 'electron';
import path from 'path';
import { getDatabase } from '../core/database/service';

/**
 * Initialize the database connection
 */
export async function initializeDatabase(): Promise<void> {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'chaycards.db');

  try {
    const db = getDatabase({
      filename: dbPath,
      verbose: process.env.NODE_ENV === 'development'
    });

    await db.initialize();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
