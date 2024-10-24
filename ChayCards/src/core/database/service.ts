/**
 * Database Service Module
 *
 * Provides a wrapper around better-sqlite3 with:
 * - Connection management
 * - Transaction support
 * - Schema versioning
 * - Migration handling
 * - Type-safe query methods
 */

import Database from 'better-sqlite3'
import { DatabaseConfig, MIGRATIONS, SCHEMA_VERSION, SchemaVersion } from './schema'

/** Type alias for SQLite parameter types */
type SqliteParams = Record<string, unknown> | unknown[]

/**
 * DatabaseService class provides a high-level interface for database operations
 * with built-in transaction support and schema management
 */
export class DatabaseService {
  private db: Database.Database
  private initialized: boolean = false

  /**
   * Creates a new DatabaseService instance
   * @param config Configuration options for the database connection
   */
  constructor(config: DatabaseConfig) {
    // Initialize SQLite connection
    this.db = new Database(config.filename, {
      verbose: config.verbose ? console.log : undefined
    })

    // Enable SQLite foreign key constraints
    this.db.pragma('foreign_keys = ON')
  }

  /**
   * Initializes the database schema and runs any pending migrations
   * This method:
   * 1. Creates schema version tracking table if it doesn't exist
   * 2. Checks current schema version
   * 3. Runs any pending migrations in order
   *
   * @throws {Error} If initialization fails
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    // Create schema version tracking table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        updated_at INTEGER NOT NULL
      );
    `)

    // Get current schema version from database
    const currentVersion = this.db
      .prepare('SELECT version FROM schema_version ORDER BY version DESC LIMIT 1')
      .get() as SchemaVersion | undefined

    // Migration function to run in transaction
    const migrationFn = (): void => {
      let version = currentVersion?.version || 0

      // Run all pending migrations in order
      while (version < SCHEMA_VERSION) {
        version++
        if (MIGRATIONS[version]) {
          // Execute migration SQL
          this.db.exec(MIGRATIONS[version])
          // Record migration completion
          this.db
            .prepare('INSERT INTO schema_version (version, updated_at) VALUES (?, ?)')
            .run(version, Date.now())
        }
      }
    }

    // Run migrations in a transaction
    this.db.transaction(migrationFn)()

    this.initialized = true
  }

  /**
   * Executes a function within a database transaction
   * Automatically rolls back on error
   *
   * @param fn Function to execute in transaction
   * @returns Result of the transaction
   */
  transaction<T>(fn: (db: DatabaseService) => T): T {
    const wrappedFn = (): T => fn(this)
    return this.db.transaction(wrappedFn)()
  }

  /**
   * Executes a prepared statement
   *
   * @param sql SQL statement to execute
   * @param params Optional parameters for the statement
   * @returns Statement execution result
   */
  run(sql: string, params?: SqliteParams): Database.RunResult {
    const stmt = this.db.prepare(sql)
    return params ? stmt.run(params) : stmt.run()
  }

  /**
   * Retrieves a single row from the database
   *
   * @param sql SQL query to execute
   * @param params Optional parameters for the query
   * @returns Single row result or undefined if not found
   */
  get<T>(sql: string, params?: SqliteParams): T | undefined {
    const stmt = this.db.prepare(sql)
    const result = params ? stmt.get(params) : stmt.get()
    return result as T | undefined
  }

  /**
   * Retrieves multiple rows from the database
   *
   * @param sql SQL query to execute
   * @param params Optional parameters for the query
   * @returns Array of query results
   */
  all<T>(sql: string, params?: SqliteParams): T[] {
    const stmt = this.db.prepare(sql)
    const results = params ? stmt.all(params) : stmt.all()
    return results as T[]
  }

  /**
   * Closes the database connection
   * Should be called when shutting down the application
   */
  close(): void {
    this.db.close()
  }

  /**
   * Gets the underlying better-sqlite3 database instance
   * Use with caution - prefer using the wrapped methods
   *
   * @returns The raw database instance
   */
  getInstance(): Database.Database {
    return this.db
  }
}

/**
 * Singleton instance of DatabaseService
 * Ensures only one database connection exists throughout the application
 */
let instance: DatabaseService | null = null

/**
 * Gets or creates the DatabaseService singleton instance
 *
 * @param config Configuration required when first creating the instance
 * @throws {Error} If trying to get instance before initialization
 * @returns DatabaseService singleton instance
 */
export const getDatabase = (config?: DatabaseConfig): DatabaseService => {
  if (!instance && config) {
    instance = new DatabaseService(config)
  } else if (!instance) {
    throw new Error('Database not initialized. Provide config on first call.')
  }
  return instance
}
