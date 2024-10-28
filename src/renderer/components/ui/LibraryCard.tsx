import React from 'react';
import { Icon } from './Icon';

interface LibraryCardProps {
  type: 'folder' | 'document';
  title: string;
  onNavigate?: () => void;
  onDelete?: () => void;
}

export function LibraryCard({ 
  type, 
  title, 
  onNavigate, 
  onDelete
}: LibraryCardProps) {
  return (
    <div 
      onClick={onNavigate}
      className="group cursor-pointer"
    >
      <div className="rounded-lg border border-border bg-surface hover:bg-surface-hover transition-all duration-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
                <Icon 
                  name={type === 'folder' ? "folder" : "document"} 
                  className="w-5 h-5"
                />
              </div>
              <span className="font-medium text-text group-hover:text-primary transition-colors">
                {title}
              </span>
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="opacity-0 group-hover:opacity-100 text-text-light hover:text-error transition-all"
              >
                <Icon name="trash" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
