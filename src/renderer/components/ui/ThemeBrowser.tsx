import React, { useState, useRef } from 'react';
import { Theme } from '../../themes';
import { Icon } from './Icon';
import { Button } from './Button';

interface ThemeBrowserProps {
  themes: Theme[];
  currentTheme: string;
  onThemeSelect: (themeId: string) => void;
}

type ThemeCategory = 'all' | 'built-in' | 'custom';

export function ThemeBrowser({ themes, currentTheme, onThemeSelect }: ThemeBrowserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentThemeData = themes.find(t => t.id === currentTheme);

  const categories: { id: ThemeCategory; label: string }[] = [
    { id: 'all', label: 'All Themes' },
    { id: 'built-in', label: 'Built-in' },
    { id: 'custom', label: 'Custom' },
  ];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                          (selectedCategory === 'built-in' && theme.isBuiltin) ||
                          (selectedCategory === 'custom' && !theme.isBuiltin);
    return matchesSearch && matchesCategory;
  });

  // Placeholder functions for theme management
  const handleImportTheme = () => {
    fileInputRef.current?.click();
  };

  const handleExportTheme = (theme: Theme) => {
    // TODO: Implement theme export
    console.log('Export theme:', theme.name);
  };

  const handleCreateTheme = () => {
    // TODO: Implement theme creation
    console.log('Create new theme');
  };

  return (
    <>
      {/* Current Theme Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-5 h-5 rounded-full ring-2 ring-border"
            style={{ backgroundColor: currentThemeData?.colors.primary }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text truncate">
                {currentThemeData?.name}
              </span>
              {currentThemeData?.isBuiltin && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-surface text-text-light">
                  Built-in
                </span>
              )}
            </div>
            <span className="text-xs text-text-light block mt-0.5 truncate">
              {currentThemeData?.description}
            </span>
          </div>
          <Icon name="chevron-right" className="w-4 h-4 text-text-light" />
        </div>
      </button>

      {/* Theme Browser Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Hidden file input for theme import */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={() => {}} // TODO: Implement theme import
          />

          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background bg-opacity-75 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text">Choose Theme</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={handleCreateTheme}>
                    <Icon name="plus" className="w-4 h-4" />
                    New Theme
                  </Button>
                  <Button onClick={handleImportTheme}>
                    Import Theme
                  </Button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-surface-hover rounded-md text-text-light hover:text-text"
                  >
                    <Icon name="plus" className="w-5 h-5 rotate-45" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <div className="p-4 space-y-4">
                  {/* Search and filters */}
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search themes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-md text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                      />
                      <Icon
                        name="plus" // TODO: Add search icon
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light"
                      />
                    </div>
                    <div className="flex rounded-md shadow-sm">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-2 text-sm font-medium border border-border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 ${
                            selectedCategory === category.id
                              ? 'bg-primary text-text-inverse border-primary'
                              : 'bg-surface text-text hover:bg-surface-hover'
                          }`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme grid */}
                  <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2">
                    <div className="grid grid-cols-2 gap-4">
                      {filteredThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onThemeSelect(theme.id);
                            setIsOpen(false);
                          }}
                          className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                            theme.id === currentTheme
                              ? 'border-primary bg-primary-bg'
                              : 'border-border bg-surface hover:bg-surface-hover'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-5 h-5 rounded-full ring-2 ring-border"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-text truncate">
                                  {theme.name}
                                </span>
                                {theme.isBuiltin && (
                                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-surface text-text-light">
                                    Built-in
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-text-light block mt-0.5 truncate">
                                {theme.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {!theme.isBuiltin && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExportTheme(theme);
                                  }}
                                  className="!p-2"
                                >
                                  <Icon name="refresh" className="w-4 h-4" />
                                </Button>
                              )}
                              {theme.id === currentTheme && (
                                <Icon name="paint" className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-1 mt-3">
                            {['primary', 'secondary', 'accent', 'background', 'text'].map((color) => (
                              <div
                                key={color}
                                className="h-2 rounded-full"
                                style={{ backgroundColor: theme.colors[color as keyof typeof theme.colors] }}
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-light">
                    {filteredThemes.length} theme{filteredThemes.length !== 1 ? 's' : ''} available
                  </span>
                  <Button onClick={() => setIsOpen(false)}>Done</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
