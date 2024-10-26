import type { ThemeColors } from '../themes';

export const draculaTheme: ThemeColors = {
  // Core Brand Colors
  primary: '#bd93f9',      // Purple - kept original
  primaryLight: '#d8b9ff', // Lighter purple for better visibility
  primaryDark: '#9d71e8',  // Darker purple for contrast
  primaryBg: '#483d6b',    // Subtle purple background
  
  secondary: '#6272a4',    // Comment color - kept original
  secondaryLight: '#7b8abc', // Lighter comment color
  secondaryDark: '#4c5987', // Darker comment color
  secondaryBg: '#313341',  // Subtle comment background
  
  accent: '#ff79c6',       // Pink - kept original
  accentLight: '#ff9cd7',  // Lighter pink
  accentDark: '#ff56b5',   // Darker pink
  accentBg: '#6b3d5c',     // Subtle pink background
  
  // UI Colors - Adjusted for better readability
  background: '#282a36',   // Background - kept original
  surface: '#313341',      // Slightly lighter than background
  surfaceHover: '#3b3e4f', // Even lighter for hover states
  surfaceActive: '#44475a', // Current Line - original dracula
  
  border: '#44475a',       // Current Line - kept original
  borderLight: '#4c5166',  // Slightly lighter border
  borderDark: '#282a36',   // Background color for dark borders
  
  // Text Colors - Adjusted for better contrast
  text: '#f8f8f2',        // Foreground - kept original
  textLight: '#bfbfbf',   // Lighter than original for better readability
  textLighter: '#8f8f8f', // Even lighter for subtle text
  textDark: '#ffffff',    // Pure white for maximum contrast
  textInverse: '#282a36', // Background color for inverse text
  
  // State Colors - Using Dracula's original colors
  success: '#50fa7b',     // Green - kept original
  successLight: '#7bff9c', // Lighter green
  successDark: '#29f55a', // Darker green
  successBg: '#3d6b4f',   // Subtle green background
  
  warning: '#ffb86c',     // Orange - kept original
  warningLight: '#ffc88d', // Lighter orange
  warningDark: '#ffa84b', // Darker orange
  warningBg: '#6b5d3d',   // Subtle orange background
  
  error: '#ff5555',       // Red - kept original
  errorLight: '#ff7777',  // Lighter red
  errorDark: '#ff3333',   // Darker red
  errorBg: '#6b3d3d',     // Subtle red background
  
  info: '#8be9fd',        // Cyan - kept original
  infoLight: '#aceffd',   // Lighter cyan
  infoDark: '#6ae3fd',    // Darker cyan
  infoBg: '#3d646b',      // Subtle cyan background
};
