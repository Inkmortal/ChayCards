import React from 'react';
import { Button } from '../ui';

interface LibraryHeaderProps {
  onCreateFolder: () => void;
}

export function LibraryHeader({ onCreateFolder }: LibraryHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold outline-none">Library</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
          onClick={onCreateFolder}
        >
          New Folder
        </Button>
        <Button
          variant="primary"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Document
        </Button>
      </div>
    </div>
  );
}
