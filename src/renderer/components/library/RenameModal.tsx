import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from '../ui';
import { Folder } from '../../../core/storage/folders/models';
import { detectNameConflict } from '../../../core/operations/folders/conflicts';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
  folders?: Folder[];
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

  const validateName = (nameToCheck: string) => {
    const trimmedName = nameToCheck.trim();
    if (!trimmedName) {
      return 'Folder name is required';
    }

    const conflict = detectNameConflict(trimmedName, parentId, folders, itemId);
    if (conflict) {
      return conflict.message;
    }

    return undefined;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setError(validateName(newName));
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const validationError = validateName(trimmedName);
    
    if (validationError) {
      setError(validationError);
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
          onChange={handleNameChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !error && name.trim()) {
              handleSubmit();
            }
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          placeholder="Enter folder name"
          autoFocus
          error={error}
        />
        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!!error || !name.trim()}
          >
            Rename
          </Button>
        </div>
      </div>
    </Modal>
  );
}
