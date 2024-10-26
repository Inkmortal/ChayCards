import React from 'react';
import { Section, Card, EmptyState, Button } from '../components/ui';

export function Library() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h1 className="text-2xl font-semibold text-text-dark">Library</h1>
        <div className="flex items-center gap-3">
          <Button
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
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

      {/* Content */}
      <div className="space-y-8">
        {/* Folders Section */}
        <Section 
          title="Folders"
          badge={{ text: "0", variant: "secondary" }}
        >
          <EmptyState
            icon={
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
            title="No folders yet"
          />
        </Section>

        {/* Documents Section */}
        <Section
          title="Documents"
          badge={{ text: "0", variant: "secondary" }}
        >
          <EmptyState
            icon={
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No documents yet"
          />
        </Section>
      </div>
    </div>
  );
}
