import React from 'react';
import { Modal, Button } from '../ui';

interface FolderConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  onRename: () => void;
  folderName: string;
}

export function FolderConflictModal({
  isOpen,
  onClose,
  onReplace,
  onRename,
  folderName,
}: FolderConflictModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Folder Already Exists">
      <div className="space-y-4">
        <p className="text-text">
          A folder named "{folderName}" already exists in this location. 
          Would you like to rename the folder or replace the existing one?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onRename}>
            Rename
          </Button>
          <Button variant="primary" onClick={onReplace}>
            Replace
          </Button>
        </div>
      </div>
    </Modal>
  );
}
