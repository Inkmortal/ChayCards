import { type ComponentType } from 'react';

/**
 * Base interface for all document types in the application
 */
export interface BaseDocument {
  id: string;
  type: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

/**
 * Interface for document type plugins
 */
export interface DocumentTypePlugin<T extends BaseDocument> {
  // Unique identifier for this document type
  type: string;

  // Display name for the UI
  displayName: string;

  // Document validation
  validateDocument: (doc: T) => Promise<boolean>;

  // Document operations
  createDocument: (data: Partial<T>) => Promise<T>;
  updateDocument: (id: string, data: Partial<T>) => Promise<T>;
  deleteDocument: (id: string) => Promise<void>;

  // UI Components (will be implemented by each plugin)
  EditorComponent: ComponentType<{ document: T }>;
  ViewerComponent: ComponentType<{ document: T }>;

  // Optional methods for specialized functionality
  importDocument?: (data: unknown) => Promise<T>;
  exportDocument?: (doc: T) => Promise<unknown>;
}

/**
 * Type-safe plugin registry that maintains the relationship between
 * document types and their plugins
 */
export class DocumentTypeRegistry {
  private static plugins = new Map<
    string,
    DocumentTypePlugin<BaseDocument>
  >();

  static registerPlugin<T extends BaseDocument>(
    plugin: DocumentTypePlugin<T>
  ): void {
    if (this.plugins.has(plugin.type)) {
      throw new Error(`Plugin type "${plugin.type}" is already registered`);
    }
    // Safe to cast here as T extends BaseDocument
    this.plugins.set(plugin.type, plugin as unknown as DocumentTypePlugin<BaseDocument>);
  }

  static getPlugin<T extends BaseDocument>(
    type: string
  ): DocumentTypePlugin<T> | undefined {
    const plugin = this.plugins.get(type);
    return plugin as unknown as DocumentTypePlugin<T> | undefined;
  }

  static getAllPlugins(): DocumentTypePlugin<BaseDocument>[] {
    return Array.from(this.plugins.values());
  }
}
