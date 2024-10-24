import React, { useState, useEffect } from 'react';
import { NoteDocument } from '../types';

interface NoteEditorProps {
  document?: NoteDocument;
  onSave: (doc: Partial<NoteDocument>) => Promise<void>;
  onBack: () => void;
  isEditing: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ document, onSave, onBack, isEditing }) => {
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(document?.title || '');
    setContent(document?.content || '');
  }, [document]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave({
        ...(document?.id ? { id: document.id } : {}),
        title: title || 'Untitled Note',
        content,
        type: 'note'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <button
          onClick={onBack}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => isEditing && setTitle(e.target.value)}
          placeholder="Untitled Note"
          readOnly={!isEditing}
          className="flex-1 mx-4 px-2 py-1 text-lg font-medium bg-transparent border-none focus:outline-none dark:text-white"
        />
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
      <textarea
        value={content}
        onChange={(e) => isEditing && setContent(e.target.value)}
        placeholder="Start writing your note here..."
        readOnly={!isEditing}
        className="flex-1 p-4 text-gray-800 bg-transparent resize-none focus:outline-none dark:text-gray-200"
      />
    </div>
  );
};
