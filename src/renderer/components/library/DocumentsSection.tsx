import React from 'react';
import { Section, EmptyState, Button } from '../ui';

export function DocumentsSection() {
  const documentCount = 0; // This would come from props in the future

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-text">Documents</span>
        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary-bg text-secondary">{documentCount}</span>
      </div>
      <EmptyState
        icon={
          <svg className="w-full h-full text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title="No documents yet"
        action={
          <Button
            variant="primary"
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Document
          </Button>
        }
      />
    </div>
  );
}
