import React from 'react';
import { Section, Card, EmptyState, Button } from '../components/ui';

export function Plugins() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h1 className="text-2xl font-semibold text-text-dark">Plugins</h1>
        <Button
          variant="primary"
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Install Plugin
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Document Types Section */}
        <Section
          title="Document Types"
          badge={{ text: "0", variant: "secondary" }}
        >
          <EmptyState
            icon={
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            }
            title="No document type plugins installed"
          />
        </Section>

        {/* Feature Plugins Section */}
        <Section
          title="Feature Plugins"
          badge={{ text: "0", variant: "secondary" }}
        >
          <EmptyState
            icon={
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            title="No feature plugins installed"
          />
        </Section>

        {/* Plugin Store Section */}
        <Section
          title="Available Plugins"
          badge={{ text: "0", variant: "secondary" }}
        >
          <EmptyState
            icon={
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            title="No plugins available in store"
            description="Check your internet connection"
          />
        </Section>
      </div>
    </div>
  );
}
