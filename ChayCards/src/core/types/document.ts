/**
 * Document Types and Plugin System Module
 *
 * This module defines the core document type system and plugin architecture:
 * - Base document interface
 * - Plugin interface for document types
 * - Type-safe plugin registry
 * - Document validation and operations
 */

import { type ComponentType } from 'react'

/**
 * Base Document Interface
 * All document types in the application must extend this interface
 * Provides common properties shared across all document types
 */
export interface BaseDocument {
  id: string              // Unique identifier
  type: string           // Document type identifier
  title: string         // Document title
  createdAt: Date      // Creation timestamp
  updatedAt: Date     // Last update timestamp
  metadata: Record<string, unknown>  // Extensible metadata
}

/**
 * Document Type Plugin Interface
 * Defines the contract that all document type plugins must implement
 *
 * @template T - Document type that extends BaseDocument
 */
export interface DocumentTypePlugin<T extends BaseDocument> {
  /** Unique identifier for the document type */
  type: string

  /** Human-readable name for UI display */
  displayName: string

  /**
   * Validates a document of this type
   * @param doc Document to validate
   * @returns Promise resolving to validation result
   */
  validateDocument: (doc: T) => Promise<boolean>

  /**
   * Creates a new document of this type
   * @param data Partial document data
   * @returns Promise resolving to created document
   */
  createDocument: (data: Partial<T>) => Promise<T>

  /**
   * Updates an existing document
   * @param id Document ID
   * @param data Partial update data
   * @returns Promise resolving to updated document
   */
  updateDocument: (id: string, data: Partial<T>) => Promise<T>

  /**
   * Deletes a document
   * @param id Document ID
   * @returns Promise resolving when deletion is complete
   */
  deleteDocument: (id: string) => Promise<void>

  /**
   * React component for editing documents of this type
   * Rendered when creating or editing documents
   */
  EditorComponent: ComponentType<{ document: T }>

  /**
   * React component for viewing documents of this type
   * Rendered when displaying documents in read-only mode
   */
  ViewerComponent: ComponentType<{ document: T }>

  /**
   * Optional: Imports document from external format
   * @param data External data to import
   * @returns Promise resolving to new document
   */
  importDocument?: (data: unknown) => Promise<T>

  /**
   * Optional: Exports document to external format
   * @param doc Document to export
   * @returns Promise resolving to exported data
   */
  exportDocument?: (doc: T) => Promise<unknown>
}

/**
 * Document Type Registry
 *
 * Manages registration and retrieval of document type plugins
 * Provides type safety through generics and runtime type checking
 */
export class DocumentTypeRegistry {
  /** Map of registered plugins keyed by type */
  private static plugins = new Map<string, DocumentTypePlugin<BaseDocument>>()

  /**
   * Registers a new document type plugin
   * Ensures type uniqueness and maintains type safety
   *
   * @template T Document type extending BaseDocument
   * @param plugin Plugin implementation
   * @throws Error if plugin type is already registered
   */
  static registerPlugin<T extends BaseDocument>(plugin: DocumentTypePlugin<T>): void {
    if (this.plugins.has(plugin.type)) {
      throw new Error(`Plugin type "${plugin.type}" is already registered`)
    }
    // Type cast is safe because T extends BaseDocument
    this.plugins.set(plugin.type, plugin as unknown as DocumentTypePlugin<BaseDocument>)
  }

  /**
   * Retrieves a plugin by type
   *
   * @template T Expected document type
   * @param type Plugin type identifier
   * @returns Plugin implementation or undefined if not found
   */
  static getPlugin<T extends BaseDocument>(type: string): DocumentTypePlugin<T> | undefined {
    const plugin = this.plugins.get(type)
    return plugin as unknown as DocumentTypePlugin<T> | undefined
  }

  /**
   * Gets all registered plugins
   *
   * @returns Array of all registered plugins
   */
  static getAllPlugins(): DocumentTypePlugin<BaseDocument>[] {
    return Array.from(this.plugins.values())
  }
}
