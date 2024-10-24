/**
 * Database Initialization Module
 *
 * This module handles the setup and initialization of the SQLite database
 * for the ChayCards application. It:
 * - Determines the appropriate database file location
 * - Establishes the database connection
 * - Performs initial setup and migrations if needed
 */

import { app } from 'electron'
import path from 'path'
import { getDatabase } from '../core/database/service'

/**
 * Initializes the database connection and performs necessary setup
 *
 * The database file is stored in the user's application data directory:
 * - Windows: %APPDATA%/ChayCards
 * - macOS: ~/Library/Application Support/ChayCards
 * - Linux: ~/.config/ChayCards
 *
 * @throws {Error} If database initialization fails
 */
export async function initializeDatabase(): Promise<void> {
  // Get the platform-specific user data path
  const userDataPath = app.getPath('userData')
  // Construct the database file path
  const dbPath = path.join(userDataPath, 'chaycards.db')

  try {
    // Get database instance with configuration
    const db = getDatabase({
      filename: dbPath,
      // Enable verbose logging in development mode
      verbose: process.env.NODE_ENV === 'development'
    })

    // Initialize database (creates tables, indices, and runs migrations)
    await db.initialize()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    // Propagate error to allow proper error handling by caller
    throw error
  }
}
