import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../../core/storage/themes/models';
import { ThemeEventData } from '../../core/storage/themes/types';
import { ElectronThemeStorage } from '../../services/storage';
import { 
  StorageAction, 
  StorageError, 
  StorageErrorCode, 
  StorageChangeEvent 
} from '../../core/storage/base';

const storage = new ElectronThemeStorage();

/**
 * Apply theme colors to document root
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const variables = Object.entries(theme.colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--chay-${cssKey}: ${value};`;
    })
    .join('\n');
  root.style.cssText = `${variables}
    transition: background-color 200ms ease-out, color 200ms ease-out;`;
}

export function useTheme() {
  const [currentTheme, setCurrentThemeState] = useState<string>('default');
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<StorageError | null>(null);

  // Load and apply theme
  const loadAndApplyTheme = useCallback(async (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      applyTheme(theme);
      setCurrentThemeState(themeId);
    }
  }, [availableThemes]);

  // Load all theme data
  const loadThemeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [themes, current] = await Promise.all([
        storage.loadThemes(),
        storage.getCurrentTheme()
      ]);

      setAvailableThemes(themes);
      await loadAndApplyTheme(current);
    } catch (error) {
      const storageError = error instanceof StorageError ? error : new StorageError(
        'Failed to load theme data',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error }
      );
      setError(storageError);
      console.error('Error loading theme data:', storageError);
    } finally {
      setIsLoading(false);
    }
  }, [loadAndApplyTheme]);

  // Initial load and event subscriptions
  useEffect(() => {
    loadThemeData();

    // Subscribe to theme updates
    const unsubscribeUpdates = storage.subscribe<ThemeEventData>(
      StorageAction.UPDATED,
      (event: StorageChangeEvent<ThemeEventData>) => {
        if (event.metadata?.operation === 'setCurrentTheme' && event.data?.currentThemeId) {
          loadAndApplyTheme(event.data.currentThemeId);
        } else {
          // Reload all theme data for other updates
          loadThemeData();
        }
      }
    );

    // Subscribe to theme creation
    const unsubscribeCreated = storage.subscribe<ThemeEventData>(
      StorageAction.CREATED,
      () => {
        loadThemeData();
      }
    );

    // Subscribe to theme deletion
    const unsubscribeDeleted = storage.subscribe<ThemeEventData>(
      StorageAction.DELETED,
      () => {
        loadThemeData();
      }
    );

    // Subscribe to errors
    const unsubscribeErrors = storage.subscribe<ThemeEventData>(
      StorageAction.ERROR,
      (event: StorageChangeEvent<ThemeEventData>) => {
        if (event.data?.error) {
          const { code, message, context } = event.data.error;
          setError(new StorageError(message, code as StorageErrorCode, context));
        }
      }
    );

    return () => {
      unsubscribeUpdates();
      unsubscribeCreated();
      unsubscribeDeleted();
      unsubscribeErrors();
    };
  }, [loadThemeData, loadAndApplyTheme]);

  const changeTheme = async (themeId: string) => {
    try {
      setError(null);
      await storage.setCurrentTheme(themeId);
      // Theme application will happen through event subscription
    } catch (error) {
      const storageError = error instanceof StorageError ? error : new StorageError(
        'Failed to change theme',
        StorageErrorCode.STORAGE_ERROR,
        { originalError: error }
      );
      setError(storageError);
      console.error('Error changing theme:', storageError);
    }
  };

  return {
    currentTheme,
    changeTheme,
    availableThemes,
    isLoading,
    error,
    reload: loadThemeData
  };
}
