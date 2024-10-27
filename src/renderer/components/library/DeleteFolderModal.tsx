import React from 'react';
import { Modal, Icon } from '../ui';

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  folderName: string;
}

export function DeleteFolderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  folderName 
}: DeleteFolderModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Folder"
    >
      <div className="flex flex-col items-center text-center pb-2">
        <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mb-4">
          <Icon name="trash" className="w-6 h-6 text-error" />
        </div>
        <h3 className="text-lg font-medium text-text-dark mb-2">
          Delete "{folderName}"?
        </h3>
        <p className="text-sm text-text-light mb-6">
          This action cannot be undone. All contents within this folder will be permanently deleted.
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-text-light hover:text-text-dark bg-surface hover:bg-surface-hover rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-error hover:bg-error/90 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
