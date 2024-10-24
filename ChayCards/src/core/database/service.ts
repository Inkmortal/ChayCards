/**
 * Database Service
 *
 * Provides database operations for the application
 */

import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

export interface DatabaseConfig {
  name?: string
  path?: string
  version?: number
}

export class DatabaseService {
  private db: Database.Database

  constructor(config?: DatabaseConfig) {
    const dbPath = config?.path || join(app.getPath('userData'), 'database.sqlite')
    this.db = new Database(dbPath)
  }

  async run(query: string, params: any[] = []): Promise<void> {
    this.db.prepare(query).run(...params)
  }

  async get<T = any>(query: string, params: any[] = []): Promise<T | null> {
    return this.db.prepare(query).get(...params) as T | null
  }

  async all<T = any>(query: string, params: any[] = []): Promise<T[]> {
    return this.db.prepare(query).all(...params) as T[]
  }
}

// Export singleton instance
export const database = new DatabaseService()
