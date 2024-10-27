import React, { useState, useEffect } from 'react';
import { Modal, Input } from '../ui';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export function RenameModal({ 
  isOpen, 
  onClose, 
  onRename, 
  currentName 
}: RenameModalProps) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setName(currentName);
    setError(undefined);
  }, [currentName, isOpen]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name cannot be empty');
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
          onChange={(e) => {
            setName(e.target.value);
            setError(undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
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
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Rename
          </button>
        </div>
      </div>
    </Modal>
  );
}
