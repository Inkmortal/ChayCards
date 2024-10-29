import { Theme, ThemeColors } from './types';
import { defaultTheme } from './default';
import { draculaTheme } from './dracula';
import { chayLightTheme, chayDarkTheme } from './chay-themes';
import { ElectronThemeStorage } from '../../services/storage';

const storage = new ElectronThemeStorage();

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

export async function applyTheme(themeId: string) {
  const themes = await storage.loadThemes();
  const theme = themes.find(t => t.id === themeId);
  if (!theme) {
    throw new Error(`Theme ${themeId} not found`);
  }

  const root = document.documentElement;
  const variables = generateThemeVariables(theme.colors);
  
  // Apply variables with transition
  root.style.cssText = variables;
}

// Create theme objects
const defaultThemeComplete: Theme = {
  id: 'default',
  name: 'Default Theme',
  description: 'The default light theme for ChayCards',
  author: 'ChayCards',
  version: '1.0.0',
  isBuiltin: true,
  colors: defaultTheme
};

const draculaThemeComplete: Theme = {
  id: 'dracula',
  name: 'Dracula Theme',
  description: 'Dark theme based on the Dracula color scheme',
  author: 'ChayCards',
  version: '1.0.0',
  isBuiltin: true,
  colors: draculaTheme
};

const chayLight: Theme = {
  id: 'chay-light',
  name: "Chay's Light Theme",
  description: "A light theme featuring Chay's signature colors with focus on readability",
  author: "ChayCards",
  version: "1.0.0",
  isBuiltin: true,
  colors: chayLightTheme
};

const chayDark: Theme = {
  id: 'chay-dark',
  name: "Chay's Dark Theme",
  description: "A dark theme featuring Chay's signature colors with focus on readability",
  author: "ChayCards",
  version: "1.0.0",
  isBuiltin: true,
  colors: chayDarkTheme
};

// Initialize built-in themes in storage
const initializeBuiltInThemes = async () => {
  const builtInThemes = [defaultThemeComplete, draculaThemeComplete, chayLight, chayDark];
  for (const theme of builtInThemes) {
    await storage.saveTheme(theme);
  }
};

// Initialize themes
initializeBuiltInThemes().catch(console.error);

// Export synchronous functions that use storage internally
export function getCurrentTheme(): string {
  return 'default'; // Default until async load completes
}

export function setCurrentTheme(themeId: string): void {
  storage.setCurrentTheme(themeId).catch(console.error);
}

export function loadThemes(): Theme[] {
  return [defaultThemeComplete, draculaThemeComplete, chayLight, chayDark];
}

export type { Theme, ThemeColors };
export {
  defaultTheme,
  draculaTheme,
  chayLightTheme,
  chayDarkTheme
};
