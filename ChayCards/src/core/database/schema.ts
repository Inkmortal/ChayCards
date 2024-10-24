/**
 * Database Schema Definition Module
 *
 * This module defines:
 * - Core document table schema
 * - Database schema version
 * - Migration system
 * - Type definitions for database configuration
 */

import { DocumentTypeRegistry } from '../types/document'

/** Current schema version - increment when adding migrations */
export const SCHEMA_VERSION = 1

/**
 * Core document table schema
 * This is the base table that all document types build upon
 */
const CORE_SCHEMA = `
  -- Documents table: Base table for all document types
  -- Serves as the parent table for polymorphic associations
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,           -- UUID for document
    type TEXT NOT NULL,            -- Document type (plugin identifier)
    title TEXT NOT NULL,           -- Document title
    created_at INTEGER NOT NULL,   -- Creation timestamp (milliseconds)
    updated_at INTEGER NOT NULL,   -- Last update timestamp (milliseconds)
    metadata TEXT,                 -- JSON metadata for extensibility
    status TEXT NOT NULL DEFAULT 'active'  -- Document status
  );

  -- Core document indexes
  CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
  CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
`

/**
 * Generates migration SQL for a specific version
 * Combines core schema with plugin-specific schemas
 */
export const generateMigrationSql = (version: number): string => {
  if (version !== 1) return '' // Only support initial migration for now

  const plugins = DocumentTypeRegistry.getAllPlugins()

  // Start with core schema
  let migrationSql = CORE_SCHEMA

  // Add plugin-specific schemas
  for (const plugin of plugins) {
    // Add tables
    migrationSql += '\n' + plugin.schema.tables.join('\n')

    // Add indexes
    migrationSql += '\n' + plugin.schema.indexes.join('\n')

    // Add initial data if provided
    if (plugin.schema.initialData) {
      migrationSql += '\n' + plugin.schema.initialData.join('\n')
    }
  }

  return migrationSql
}

/**
 * Database migrations keyed by version number
 * Each migration should be idempotent
 */
export const MIGRATIONS: Record<number, string> = {
  1: generateMigrationSql(1)
}

/**
 * Valid table names in the database
 * Core tables only - plugin tables are managed by their respective plugins
 */
export type CoreTableName = 'documents'

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  filename: string      // Path to SQLite database file
  verbose?: boolean    // Enable verbose logging
}

/**
 * Schema version information stored in database
 */
export interface SchemaVersion {
  version: number     // Schema version number
  updated_at: number  // Last update timestamp
}
