import { database } from '../../core/database/service';
import { NoteDocument } from './types';

export class NotesRepository {
  constructor(private db: typeof database) {}

  async createNote(note: NoteDocument): Promise<void> {
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

    await this.db.run('INSERT INTO notes (id, content, word_count) VALUES (?, ?, ?)', [
      note.id,
      note.content,
      note.content.split(/\s+/).length
    ]);
  }

  async updateNote(note: Partial<NoteDocument> & { id: string }): Promise<void> {
    if (note.title || note.updatedAt || note.status || note.metadata) {
      await this.db.run(
        `UPDATE documents SET
          title = COALESCE(?, title),
          updated_at = COALESCE(?, updated_at),
          status = COALESCE(?, status),
          metadata = COALESCE(?, metadata)
        WHERE id = ?`,
        [
          note.title,
          note.updatedAt?.getTime(),
          note.status,
          note.metadata ? JSON.stringify(note.metadata) : undefined,
          note.id
        ]
      );
    }

    if (note.content) {
      await this.db.run('UPDATE notes SET content = ?, word_count = ? WHERE id = ?', [
        note.content,
        note.content.split(/\s+/).length,
        note.id
      ]);
    }
  }

  async getNoteById(id: string): Promise<NoteDocument | null> {
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

  async getAllNotes(): Promise<NoteDocument[]> {
    const results = await this.db.all(
      `SELECT
        d.id, d.type, d.title, d.created_at, d.updated_at, d.status, d.metadata,
        n.content
      FROM documents d
      JOIN notes n ON n.id = d.id
      WHERE d.type = 'note'
      ORDER BY d.updated_at DESC`
    );

    return results.map((result) => ({
      id: result.id,
      type: 'note',
      title: result.title,
      content: result.content,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
      status: result.status,
      metadata: JSON.parse(result.metadata || '{}')
    }));
  }

  async deleteNote(id: string): Promise<void> {
    await this.db.run('DELETE FROM notes WHERE id = ?', [id]);
    await this.db.run('DELETE FROM documents WHERE id = ?', [id]);
  }
}
