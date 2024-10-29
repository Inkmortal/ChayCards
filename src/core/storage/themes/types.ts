import { Theme } from './models';
import { DataStorage, StorageEventEmitter, StorageChangeEvent } from '../base';

/**
 * Theme event data types
 */
export interface ThemeEventData {
  currentThemeId?: string;
  theme?: Theme;
  themes?: Theme[];
  error?: {
    code: string;
    message: string;
    context?: any;
  };
}

/**
 * Theme-specific storage interface with enhanced capabilities
 */
export interface ThemeStorage extends DataStorage<Theme[]>, StorageEventEmitter {
  /**
   * Load all themes from storage
   * Emits: UPDATED event with loaded themes
   */
  loadThemes(): Promise<Theme[]>;

  /**
   * Save a theme to storage
   * Emits: UPDATED event with saved theme
   * @param theme Theme to save
   */
  saveTheme(theme: Theme): Promise<void>;

  /**
   * Delete a theme from storage
   * Emits: DELETED event with theme ID
   * @param themeId ID of theme to delete
   */
  deleteTheme(themeId: string): Promise<void>;

  /**
   * Get the current theme ID
   * Emits: UPDATED event with current theme ID
   */
  getCurrentTheme(): Promise<string>;

  /**
   * Set the current theme
   * Emits: UPDATED event with new theme ID
   * @param themeId ID of theme to set as current
   */
  setCurrentTheme(themeId: string): Promise<void>;

  /**
   * Export a theme to JSON
   * @param theme Theme to export
   */
  exportTheme(theme: Theme): string;

  /**
   * Import a theme from JSON
   * Emits: CREATED event with imported theme
   * @param themeJson Theme JSON to import
   */
  importTheme(themeJson: string): Promise<Theme>;
}
