import React, { useState, useEffect } from 'react';
import { Modal, Input } from '../ui';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
  folders?: { id: string; name: string; parentId: string | null; }[];
  parentId?: string | null;
  itemId?: string;
}

export function RenameModal({ 
  isOpen, 
  onClose, 
  onRename, 
  currentName,
  folders = [],
  parentId = null,
  itemId
}: RenameModalProps) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setName(currentName);
    setError(undefined);
  }, [currentName, isOpen]);

  const checkNameUniqueness = (nameToCheck: string): boolean => {
    if (!folders.length) return true;
    
    return !folders.some(
      folder => folder.id !== itemId && 
                folder.parentId === parentId && 
                folder.name.toLowerCase() === nameToCheck.toLowerCase()
    );
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!checkNameUniqueness(newName)) {
      setError('A folder with this name already exists');
    } else {
      setError(undefined);
    }
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }

    if (!checkNameUniqueness(trimmedName)) {
      setError('A folder with this name already exists');
      return;
    }

    onRename(trimmedName);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rename Folder"
    >
      <div className="space-y-4">
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !error) handleSubmit();
            if (e.key === 'Escape') onClose();
          }}
          placeholder="Enter folder name"
          autoFocus
          error={error}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-light hover:text-text-dark bg-surface hover:bg-surface-hover rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!!error}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              error 
                ? 'bg-primary/50 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            Rename
          </button>
        </div>
      </div>
    </Modal>
  );
}
