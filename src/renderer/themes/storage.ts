import { Theme } from './types';

const STORAGE_KEY = 'chay-themes';
const CURRENT_THEME_KEY = 'chay-current-theme';

export function loadThemes(): Theme[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading themes:', error);
  }
  return [];
}

export function saveTheme(theme: Theme): void {
  try {
    const currentThemes = loadThemes();
    const index = currentThemes.findIndex(t => t.id === theme.id);
    if (index >= 0) {
      currentThemes[index] = theme;
    } else {
      currentThemes.push(theme);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentThemes));
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

export function deleteTheme(themeId: string): void {
  try {
    const currentThemes = loadThemes();
    const filtered = currentThemes.filter(t => t.id !== themeId && !t.isBuiltin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting theme:', error);
  }
}

export function getCurrentTheme(): string {
  return localStorage.getItem(CURRENT_THEME_KEY) || 'default';
}

export function setCurrentTheme(themeId: string): void {
  localStorage.setItem(CURRENT_THEME_KEY, themeId);
}

export function exportTheme(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

export function importTheme(themeJson: string): Theme {
  const theme = JSON.parse(themeJson) as Theme;
  saveTheme(theme);
  return theme;
}
