import type { ThemeColors } from '../themes';

export const draculaTheme: ThemeColors = {
  // Core Brand Colors - Using official Dracula colors
  primary: '#bd93f9',      // Purple as primary
  primaryLight: '#cfa9fa', // Lighter purple
  primaryDark: '#ab7af8',  // Darker purple
  primaryBg: '#44475a',    // Current line color
  
  secondary: '#ff79c6',    // Pink as secondary
  secondaryLight: '#ff8acd', // Lighter pink
  secondaryDark: '#ff68bf', // Darker pink
  secondaryBg: '#44475a',  // Current line color
  
  accent: '#8be9fd',       // Cyan as accent
  accentLight: '#9fecfd',  // Lighter cyan
  accentDark: '#77e6fd',   // Darker cyan
  accentBg: '#44475a',     // Current line color
  
  // UI Colors - Using official Dracula colors
  background: '#282a36',   // Background
  surface: '#2f313d',      // Slightly lighter than background
  surfaceHover: '#44475a', // Current line color
  surfaceActive: '#4a4d63', // Slightly lighter than current line
  
  border: '#44475a',       // Current line color
  borderLight: '#4a4d63',  // Slightly lighter than current line
  borderDark: '#282a36',   // Background color
  
  // Text Colors - Using official Dracula colors
  text: '#f8f8f2',        // Foreground
  textLight: '#6272a4',   // Comment color
  textLighter: '#6272a4', // Comment color
  textDark: '#f8f8f2',    // Foreground
  textInverse: '#282a36', // Background color
  
  // State Colors - Using official Dracula colors
  success: '#50fa7b',     // Green
  successLight: '#69fb8f',
  successDark: '#37f967',
  successBg: '#44475a',   // Current line color
  
  warning: '#ffb86c',     // Orange
  warningLight: '#ffc281',
  warningDark: '#ffae57',
  warningBg: '#44475a',   // Current line color
  
  error: '#ff5555',       // Red
  errorLight: '#ff6a6a',
  errorDark: '#ff4040',
  errorBg: '#44475a',     // Current line color
  
  info: '#f1fa8c',        // Yellow
  infoLight: '#f3fb9c',
  infoDark: '#eff97c',
  infoBg: '#44475a',      // Current line color
};
