import { useState, useEffect } from 'react';
import { getCurrentTheme, setCurrentTheme, loadThemes, applyTheme } from '../themes';

export function useTheme() {
  const [currentTheme, setCurrentThemeState] = useState(getCurrentTheme());

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    setCurrentThemeState(themeId);
    applyTheme(themeId); // Apply theme immediately when changed
  };

  // Apply theme on mount and theme changes
  useEffect(() => {
    const themes = loadThemes();
    const theme = themes.find(t => t.id === currentTheme);
    if (!theme) {
      // Fallback to default if current theme is not found
      changeTheme('default');
    } else {
      // Apply current theme
      applyTheme(currentTheme);
    }
  }, [currentTheme]);

  return {
    currentTheme,
    changeTheme,
    availableThemes: loadThemes(),
  };
}
