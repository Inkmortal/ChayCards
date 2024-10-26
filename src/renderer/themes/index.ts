import { Theme, ThemeColors } from './types';
import { defaultTheme } from './default';
import { draculaTheme } from './dracula';
import {
  loadThemes,
  saveTheme,
  deleteTheme,
  getCurrentTheme,
  setCurrentTheme,
  exportTheme,
  importTheme,
} from './storage';

export function generateThemeVariables(theme: ThemeColors): string {
  const cssVariables = Object.entries(theme)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--chay-${cssKey}: ${value};`;
    })
    .join('\n');

  // Add transition property to ensure smooth theme changes
  return `${cssVariables}
  transition: background-color 200ms ease-out, color 200ms ease-out;`;
}

export function applyTheme(themeId: string) {
  const themes = loadThemes();
  const theme = themes.find(t => t.id === themeId);
  if (!theme) {
    throw new Error(`Theme ${themeId} not found`);
  }

  const root = document.documentElement;
  const variables = generateThemeVariables(theme.colors);
  
  // Apply variables with transition
  root.style.cssText = variables;
}

export type { Theme, ThemeColors };
export {
  defaultTheme,
  draculaTheme,
  loadThemes,
  saveTheme,
  deleteTheme,
  getCurrentTheme,
  setCurrentTheme,
  exportTheme,
  importTheme,
};
