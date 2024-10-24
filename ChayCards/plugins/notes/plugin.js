import { v4 as uuidv4 } from 'uuid';
import { ComponentType } from 'react';
import { database } from '../../core/database/service';
import { DocumentTypePlugin } from '../../core/types/document';
import { NoteDocument } from './types';
import { notesSchema } from './schema';
import { NoteEditor } from './components/NoteEditor';

type EditorComponentType = ComponentType<{
  document?: NoteDocument;
  onSave: (doc: Partial<NoteDocument>) => Promise<void>;
  onBack: () => void;
  isEditing: boolean;
}>;

export class NotesPlugin implements DocumentTypePlugin<NoteDocument> {
  public readonly type = 'note';
  public readonly displayName = 'Notes';
  public readonly schema = notesSchema;
  public readonly EditorComponent: EditorComponentType = NoteEditor;

  constructor(private db: typeof database) {}

  async initialize(): Promise<void> {
    await this.db.run(notesSchema);
  }

  async validateDocument(doc: NoteDocument): Promise<boolean> {
    return doc.title.length > 0;
  }

  async createDocument(data: Partial<NoteDocument>): Promise<NoteDocument> {
    const now = new Date();
    const note: NoteDocument = {
      id: uuidv4(),
      type: 'note',
      title: data.title || 'Untitled Note',
      content: data.content || '',
      createdAt: now,
      updatedAt: now,
      status: 'active',
      metadata: {
        wordCount: (data.content || '').split(/\s+/).length,
        lastEditedAt: now
      }
    };

    await this.db.run(
      'INSERT INTO documents (id, type, title, created_at, updated_at, status, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        note.id,
        note.type,
        note.title,
        note.createdAt.getTime(),
        note.updatedAt.getTime(),
        note.status,
        JSON.stringify(note.metadata)
      ]
    );

    await this.db.run('INSERT INTO notes (id, content) VALUES (?, ?)', [
      note.id,
      note.content
    ]);

    return note;
  }

  async updateDocument(id: string, data: Partial<NoteDocument>): Promise<NoteDocument> {
    const now = new Date();
    const updates: any[] = [];
    const params: any[] = [];

    if (data.title) {
      updates.push('title = ?');
      params.push(data.title);
    }

    updates.push('updated_at = ?');
    params.push(now.getTime());

    if (data.status) {
      updates.push('status = ?');
      params.push(data.status);
    }

    if (data.metadata) {
      updates.push('metadata = ?');
      params.push(JSON.stringify(data.metadata));
    }

    params.push(id);

    if (updates.length > 0) {
      await this.db.run(
        `UPDATE documents SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    if (data.content !== undefined) {
      await this.db.run(
        'UPDATE notes SET content = ? WHERE id = ?',
        [data.content, id]
      );
    }

    const updated = await this.getDocument(id);
    if (!updated) {
      throw new Error('Failed to update note');
    }

    return updated;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.db.run('DELETE FROM notes WHERE id = ?', [id]);
    await this.db.run('DELETE FROM documents WHERE id = ?', [id]);
  }

  async getAllDocuments(): Promise<NoteDocument[]> {
    const results = await this.db.all(
      `SELECT
        d.id, d.type, d.title, d.created_at, d.updated_at, d.status, d.metadata,
        n.content
      FROM documents d
      JOIN notes n ON n.id = d.id
      WHERE d.type = 'note'
      ORDER BY d.updated_at DESC`
    );

    return results.map(row => ({
      id: row.id,
      type: 'note',
      title: row.title,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      status: row.status,
      metadata: JSON.parse(row.metadata || '{}')
    }));
  }

  private async getDocument(id: string): Promise<NoteDocument | null> {
    const result = await this.db.get(
      `SELECT
        d.id, d.type, d.title, d.created_at, d.updated_at, d.status, d.metadata,
        n.content
      FROM documents d
      JOIN notes n ON n.id = d.id
      WHERE d.id = ?`,
      [id]
    );

    if (!result) return null;

    return {
      id: result.id,
      type: 'note',
      title: result.title,
      content: result.content,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
      status: result.status,
      metadata: JSON.parse(result.metadata || '{}')
    };
  }
}

// Export the plugin class as default
export default NotesPlugin;
