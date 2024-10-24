import Database from 'better-sqlite3';
import { DatabaseConfig, MIGRATIONS, SCHEMA_VERSION, SchemaVersion } from './schema';

type SqliteParams = Record<string, unknown> | unknown[];

/**
 * Database service for managing SQLite connections and operations
 */
export class DatabaseService {
  private db: Database.Database;
  private initialized: boolean = false;

  constructor(config: DatabaseConfig) {
    this.db = new Database(config.filename, {
      verbose: config.verbose ? console.log : undefined
    });

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
  }

  /**
   * Initialize the database and run migrations
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Create schema_version table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        updated_at INTEGER NOT NULL
      );
    `);

    // Get current schema version
    const currentVersion = this.db
      .prepare('SELECT version FROM schema_version ORDER BY version DESC LIMIT 1')
      .get() as SchemaVersion | undefined;

    // Run migrations
    const migrationFn = (): void => {
      let version = currentVersion?.version || 0;

      while (version < SCHEMA_VERSION) {
        version++;
        if (MIGRATIONS[version]) {
          this.db.exec(MIGRATIONS[version]);
          this.db
            .prepare(
              'INSERT INTO schema_version (version, updated_at) VALUES (?, ?)'
            )
            .run(version, Date.now());
        }
      }
    };

    this.db.transaction(migrationFn)();

    this.initialized = true;
  }

  /**
   * Execute a query within a transaction
   */
  transaction<T>(fn: (db: DatabaseService) => T): T {
    const wrappedFn = (): T => fn(this);
    return this.db.transaction(wrappedFn)();
  }

  /**
   * Run a prepared statement
   */
  run(sql: string, params?: SqliteParams): Database.RunResult {
    const stmt = this.db.prepare(sql);
    return params ? stmt.run(params) : stmt.run();
  }

  /**
   * Get a single row
   */
  get<T>(sql: string, params?: SqliteParams): T | undefined {
    const stmt = this.db.prepare(sql);
    const result = params ? stmt.get(params) : stmt.get();
    return result as T | undefined;
  }

  /**
   * Get multiple rows
   */
  all<T>(sql: string, params?: SqliteParams): T[] {
    const stmt = this.db.prepare(sql);
    const results = params ? stmt.all(params) : stmt.all();
    return results as T[];
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }

  /**
   * Get the underlying database instance
   */
  getInstance(): Database.Database {
    return this.db;
  }
}

// Export a singleton instance
let instance: DatabaseService | null = null;

export const getDatabase = (config?: DatabaseConfig): DatabaseService => {
  if (!instance && config) {
    instance = new DatabaseService(config);
  } else if (!instance) {
    throw new Error('Database not initialized. Provide config on first call.');
  }
  return instance;
};
