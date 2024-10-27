import React from 'react';
import { Modal, Input, Button } from '../ui';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  onFolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  onSubmit: () => void;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  folderName,
  onFolderNameChange,
  onKeyDown,
  error,
  onSubmit
}: CreateFolderModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
    >
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={onFolderNameChange}
          onKeyDown={onKeyDown}
          error={error}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
}
