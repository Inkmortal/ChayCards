import { Theme, ThemeMetadata } from './types';
import { defaultTheme } from './default';
import { draculaTheme } from './dracula';

const THEMES_STORAGE_KEY = 'chay-cards-themes';
const CURRENT_THEME_KEY = 'chay-cards-current-theme';

// Built-in themes
const builtinThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Light theme with blue accents',
    author: 'ChayCards',
    version: '1.0.0',
    isBuiltin: true,
    colors: defaultTheme,
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme inspired by Dracula',
    author: 'ChayCards',
    version: '1.0.0',
    isBuiltin: true,
    colors: draculaTheme,
  },
];

/**
 * Load all themes from storage, including built-in themes
 */
export function loadThemes(): Theme[] {
  const storedThemes = JSON.parse(localStorage.getItem(THEMES_STORAGE_KEY) || '[]') as Theme[];
  return [...builtinThemes, ...storedThemes];
}

/**
 * Save a custom theme to storage
 */
export function saveTheme(theme: Theme): void {
  if (theme.isBuiltin) {
    throw new Error('Cannot modify built-in themes');
  }

  const themes = loadThemes().filter(t => !t.isBuiltin);
  const existingIndex = themes.findIndex(t => t.id === theme.id);

  if (existingIndex >= 0) {
    themes[existingIndex] = theme;
  } else {
    themes.push(theme);
  }

  localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));
}

/**
 * Delete a custom theme from storage
 */
export function deleteTheme(themeId: string): void {
  const theme = loadThemes().find(t => t.id === themeId);
  if (!theme || theme.isBuiltin) {
    throw new Error('Cannot delete built-in themes');
  }

  const themes = loadThemes()
    .filter(t => !t.isBuiltin)
    .filter(t => t.id !== themeId);

  localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));

  // If the deleted theme was active, switch to default
  if (getCurrentTheme() === themeId) {
    setCurrentTheme('default');
  }
}

/**
 * Get the current theme ID
 */
export function getCurrentTheme(): string {
  return localStorage.getItem(CURRENT_THEME_KEY) || 'default';
}

/**
 * Set the current theme
 */
export function setCurrentTheme(themeId: string): void {
  const themes = loadThemes();
  const theme = themes.find(t => t.id === themeId);
  if (!theme) {
    throw new Error(`Theme ${themeId} not found`);
  }

  localStorage.setItem(CURRENT_THEME_KEY, themeId);
}

/**
 * Export a theme to a JSON file
 */
export function exportTheme(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import a theme from a JSON string
 * @returns The imported theme
 * @throws Error if the theme is invalid
 */
export function importTheme(jsonString: string): Theme {
  try {
    const theme = JSON.parse(jsonString) as Theme;
    
    // Validate theme structure
    if (!theme.id || !theme.name || !theme.colors) {
      throw new Error('Invalid theme structure');
    }

    // Ensure it's not marked as built-in
    theme.isBuiltin = false;

    // Generate a unique ID if it conflicts with existing themes
    const existingThemes = loadThemes();
    if (existingThemes.some(t => t.id === theme.id)) {
      theme.id = `${theme.id}-${Date.now()}`;
    }

    return theme;
  } catch (error) {
    throw new Error('Invalid theme file');
  }
}
