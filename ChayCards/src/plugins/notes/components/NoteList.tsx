import React from 'react';
import { NoteDocument } from '../types';

interface NoteListProps {
  notes: NoteDocument[];
  onNoteSelect: (note: NoteDocument) => void;
  onCreateNote: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, onNoteSelect, onCreateNote }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold dark:text-white">Notes</h2>
        <button
          onClick={onCreateNote}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          New Note
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note)}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border dark:border-gray-700"
          >
            <h3 className="text-lg font-medium mb-2 dark:text-white">
              {note.title || 'Untitled Note'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {note.content || 'No content'}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Last edited {formatDate(note.updatedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
