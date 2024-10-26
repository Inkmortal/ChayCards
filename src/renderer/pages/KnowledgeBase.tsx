import React, { useState } from 'react';
import { Card, Section, EmptyState } from '../components/ui';

interface KnowledgeBaseEntry {
  id: string;
  name: string;
  path: string;
  type: 'pdf' | 'video' | 'image' | 'document' | 'other';
  addedAt: Date;
  tags: string[];
  category: string;
  folder: string;
}

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: Date;
  context: string[];  // IDs of documents used in context
}

export function KnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [promptHistory] = useState<PromptHistory[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('root');

  // Placeholder data
  const categories = ['All', 'Research', 'Documentation', 'Learning', 'Reference'];
  const tags = ['Important', 'Review', 'Archive', 'Shared', 'Personal'];
  const folders = ['Root', 'Projects', 'Articles', 'Books', 'Media'];

  // Placeholder for future file selection functionality
  const handleAddResource = () => {
    console.log('Add resource clicked');
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-dark">Knowledge Base</h1>
        <p className="mt-2 text-text-light">
          Organize, search, and analyze your knowledge resources.
        </p>
      </div>

      {/* Organization and Search Controls */}
      <Section title="Browse & Search">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Bar */}
          <div className="col-span-full">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full px-4 py-2 rounded-md border border-border bg-surface"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-surface"
          >
            {categories.map(cat => (
              <option key={cat.toLowerCase()} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>

          {/* Folder Selection */}
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-surface"
          >
            {folders.map(folder => (
              <option key={folder.toLowerCase()} value={folder.toLowerCase()}>{folder}</option>
            ))}
          </select>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'type')}
            className="px-4 py-2 rounded-md border border-border bg-surface"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>

          {/* Add Resource Button */}
          <button
            onClick={handleAddResource}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Resource
          </button>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTags(prev => 
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
              )}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-light hover:bg-surface-hover'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </Section>

      {/* Resources Display */}
      <Section title="Resources" className="mt-6">
        {entries.length === 0 ? (
          <div className="cursor-pointer" onClick={handleAddResource}>
            <EmptyState
              icon={
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              title="No resources added yet"
              description="Add documents, PDFs, videos, or other files to your knowledge base."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-text-dark">{entry.name}</h3>
                    <p className="text-sm text-text-light mt-1">{entry.path}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-xs bg-surface px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-text-light mt-2">
                      Added {entry.addedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {entry.type}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* AI Interaction Section */}
      <Section title="Knowledge Assistant" className="mt-6">
        <Card className="p-4">
          <div className="mb-4">
            <textarea
              placeholder="Ask a question or provide a prompt to analyze your knowledge base..."
              className="w-full px-4 py-2 rounded-md border border-border bg-surface min-h-[100px] resize-none"
            />
            <div className="flex gap-2 mt-2">
              <select className="px-4 py-2 rounded-md border border-border bg-surface">
                <option value="all">All Documents</option>
                <option value="selected">Selected Documents</option>
                <option value="category">Current Category</option>
                <option value="folder">Current Folder</option>
              </select>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Submit Prompt
              </button>
            </div>
          </div>
        </Card>
      </Section>

      {/* Knowledge Graph Visualization Placeholder */}
      <Section title="Knowledge Graph" className="mt-6">
        <Card className="p-4">
          <div className="bg-surface-hover rounded-lg p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-text-light mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-text-light">
              Knowledge Graph Visualization
            </p>
            <p className="text-sm text-text-lighter mt-2">
              Visualize connections and relationships between your documents based on content similarity and references.
            </p>
          </div>
        </Card>
      </Section>

      {/* Prompt History */}
      <Section title="Prompt History" className="mt-6">
        <Card className="p-4">
          {promptHistory.length === 0 ? (
            <p className="text-text-light text-center py-4">No prompts yet. Start asking questions to build your history.</p>
          ) : (
            <div className="space-y-4">
              {promptHistory.map((item) => (
                <div key={item.id} className="border-b border-border pb-4">
                  <p className="text-text-dark">{item.prompt}</p>
                  <p className="text-sm text-text-light mt-1">
                    {item.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Section>
    </div>
  );
}
