import { ThemeStorage } from '../../../core/storage/themes/types';
import { Theme } from '../../../core/storage/themes/models';
import { 
  StorageError,
  StorageErrorCode,
  StorageChangeEvent,
  StorageAction
} from '../../../core/storage/base';

const STORAGE_KEY = 'chay-themes';
const CURRENT_THEME_KEY = 'chay-current-theme';

// Log levels to control console output
const enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class ElectronThemeStorage implements ThemeStorage {
  private subscribers: Map<StorageAction, Set<Function>> = new Map();
  private generalSubscribers: Set<Function> = new Set();
  private logLevel: LogLevel = LogLevel.ERROR; // Default to errors only

  async load(): Promise<Theme[]> {
    return this.loadThemes();
  }

  async save(themes: Theme[]): Promise<Theme[]> {
    await this.saveThemes(themes);
    return themes;
  }

  async loadThemes(): Promise<Theme[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const themes = stored ? JSON.parse(stored) : [];

      this.emitEvent({
        type: StorageAction.UPDATED,
        data: themes,
        timestamp: Date.now(),
        metadata: { operation: 'load' }
      }, LogLevel.DEBUG);

      return themes;
    } catch (error) {
      const storageError = new StorageError(
        'Failed to load themes',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  async saveTheme(theme: Theme): Promise<void> {
    try {
      const currentThemes = await this.loadThemes();
      const index = currentThemes.findIndex(t => t.id === theme.id);
      
      if (index >= 0) {
        currentThemes[index] = theme;
      } else {
        currentThemes.push(theme);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentThemes));

      this.emitEvent({
        type: StorageAction.UPDATED,
        data: { theme, isNew: index === -1 },
        timestamp: Date.now(),
        metadata: { 
          operation: index >= 0 ? 'update' : 'create',
          themeId: theme.id
        }
      }, LogLevel.INFO);
    } catch (error) {
      const storageError = new StorageError(
        'Failed to save theme',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error, themeId: theme.id }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  async deleteTheme(themeId: string): Promise<void> {
    try {
      const currentThemes = await this.loadThemes();
      const filtered = currentThemes.filter(t => t.id !== themeId && !t.isBuiltin);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      this.emitEvent({
        type: StorageAction.DELETED,
        data: { themeId },
        timestamp: Date.now(),
        metadata: { operation: 'delete' }
      }, LogLevel.INFO);
    } catch (error) {
      const storageError = new StorageError(
        'Failed to delete theme',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error, themeId }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  async getCurrentTheme(): Promise<string> {
    return localStorage.getItem(CURRENT_THEME_KEY) || 'default';
  }

  async setCurrentTheme(themeId: string): Promise<void> {
    try {
      localStorage.setItem(CURRENT_THEME_KEY, themeId);

      this.emitEvent({
        type: StorageAction.UPDATED,
        data: { currentThemeId: themeId },
        timestamp: Date.now(),
        metadata: { operation: 'setCurrentTheme' }
      }, LogLevel.INFO);
    } catch (error) {
      const storageError = new StorageError(
        'Failed to set current theme',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error, themeId }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  exportTheme(theme: Theme): string {
    return JSON.stringify(theme, null, 2);
  }

  async importTheme(themeJson: string): Promise<Theme> {
    try {
      const theme = JSON.parse(themeJson) as Theme;
      await this.saveTheme(theme);

      this.emitEvent({
        type: StorageAction.CREATED,
        data: { theme },
        timestamp: Date.now(),
        metadata: { operation: 'import' }
      }, LogLevel.INFO);

      return theme;
    } catch (error) {
      const storageError = new StorageError(
        'Failed to import theme',
        StorageErrorCode.INVALID_DATA,
        { originalError: error }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }

  subscribe<T>(
    action: StorageAction,
    callback: (event: StorageChangeEvent<T>) => void
  ): () => void {
    if (!this.subscribers.has(action)) {
      this.subscribers.set(action, new Set());
    }
    this.subscribers.get(action)!.add(callback);

    return () => {
      const callbacks = this.subscribers.get(action);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(action);
        }
      }
    };
  }

  subscribeToUpdates(callback: () => void): () => void {
    this.generalSubscribers.add(callback);
    return () => {
      this.generalSubscribers.delete(callback);
    };
  }

  private emitEvent<T>(event: StorageChangeEvent<T>, level: LogLevel = LogLevel.DEBUG): void {
    // Emit to specific event subscribers
    const callbacks = this.subscribers.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }

    // Emit to general subscribers
    this.generalSubscribers.forEach(callback => callback());

    // Log events based on level
    if (level <= this.logLevel) {
      if (level === LogLevel.ERROR) {
        console.error('Theme storage event:', event);
      } else if (level === LogLevel.WARN) {
        console.warn('Theme storage event:', event);
      } else if (level === LogLevel.INFO) {
        console.info('Theme storage event:', event);
      } else {
        console.debug('Theme storage event:', event);
      }
    }
  }

  private async saveThemes(themes: Theme[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));

      this.emitEvent({
        type: StorageAction.UPDATED,
        data: themes,
        timestamp: Date.now(),
        metadata: { operation: 'saveAll' }
      }, LogLevel.INFO);
    } catch (error) {
      const storageError = new StorageError(
        'Failed to save themes',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error }
      );
      
      this.emitEvent(storageError.toEvent(), LogLevel.ERROR);
      throw storageError;
    }
  }
}
