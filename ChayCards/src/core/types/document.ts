import { ComponentType } from 'react';

export interface BaseDocument {
  id: string;
  type: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  metadata: Record<string, any>;
}

export interface DocumentTypePlugin<T extends BaseDocument> {
  type: string;
  displayName: string;
  schema: any;
  initialize(): Promise<void>;
  validateDocument(doc: T): Promise<boolean>;
  createDocument(data: Partial<T>): Promise<T>;
  updateDocument(id: string, data: Partial<T>): Promise<T>;
  deleteDocument(id: string): Promise<void>;
  getAllDocuments(): Promise<T[]>;
  EditorComponent: ComponentType<{
    document?: T;
    onSave: (doc: Partial<T>) => Promise<void>;
    onBack: () => void;
    isEditing: boolean;
  }>;
}

export class DocumentTypeRegistry {
  private plugins: Map<string, DocumentTypePlugin<any>> = new Map();

  registerPlugin(plugin: DocumentTypePlugin<any>): void {
    this.plugins.set(plugin.type, plugin);
  }

  getPlugin(type: string): DocumentTypePlugin<any> | undefined {
    return this.plugins.get(type);
  }

  getAllPlugins(): DocumentTypePlugin<any>[] {
    return Array.from(this.plugins.values());
  }
}
