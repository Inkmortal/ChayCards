import { ThemeColors } from './types';

// Light theme - Sunny room with plants and pink accents
export const chayLightTheme: ThemeColors = {
  // Brand Colors - Feminine and natural
  primary: '#FF9EC6', // Warm pink that pops
  primaryLight: '#FFB5D8', // Soft bubblegum pink
  primaryDark: '#FF87B5', // Deep pink
  primaryBg: '#FFF0F6', // Very soft pink background

  secondary: '#6BB36D', // Fresh plant green
  secondaryLight: '#8DC58F', // Sunlit leaf green
  secondaryDark: '#4C994E', // Shadow leaf green
  secondaryBg: '#F3F9F3', // Morning dew green

  accent: '#E9E4FF', // Soft lavender
  accentLight: '#F2EEFF', // Morning lavender
  accentDark: '#DCD4FF', // Evening lavender
  accentBg: '#FBFAFF', // Barely-there lavender

  // UI Colors - Warm and inviting
  background: '#FFF9FA', // Warm white with pink undertone
  surface: '#FFF5F7', // Soft pink-white
  surfaceHover: '#FFF0F3', // Slightly deeper pink-white
  surfaceActive: '#FFE8ED', // Pressed state

  border: '#FFE0E9', // Soft pink border
  borderLight: '#FFF0F5', // Very light pink border
  borderDark: '#FFD4E3', // Slightly deeper pink border

  // Text Colors - Warm and readable
  text: '#2D2D2D', // Soft black for better readability
  textLight: '#575757', // Warm gray
  textLighter: '#787878', // Light warm gray
  textDark: '#1A1A1A', // Deep warm gray
  textInverse: '#FFFFFF', // Pure white for contrast

  // State Colors - Gentle but clear
  success: '#6BB36D', // Fresh plant green
  successLight: '#8DC58F',
  successDark: '#4C994E',
  successBg: '#F3F9F3',

  warning: '#FFB37C', // Warm peach
  warningLight: '#FFC59A',
  warningDark: '#FFA15E',
  warningBg: '#FFF6F0',

  error: '#FF8BA7', // Soft rose
  errorLight: '#FFA5BA',
  errorDark: '#FF7194',
  errorBg: '#FFF0F4',

  info: '#82B1FF', // Soft sky blue
  infoLight: '#A1C4FF',
  infoDark: '#639FFF',
  infoBg: '#F5F8FF',
};

// Dark theme - Cozy bedroom with soft pink lighting and moonlit plants
export const chayDarkTheme: ThemeColors = {
  // Brand Colors - Evening versions of feminine colors
  primary: '#FF9EC6', // Warm pink like a bedside lamp
  primaryLight: '#FFB5D8',
  primaryDark: '#FF87B5',
  primaryBg: '#453438', // Warm rose-tinted shadow

  secondary: '#88C18A', // Moonlit plant green
  secondaryLight: '#A5D4A7', // Gentle leaf highlights
  secondaryDark: '#6BA86D', // Soft leaf shadows
  secondaryBg: '#393F3A', // Subtle green-tinted shadow

  accent: '#E9E4FF', // Soft evening lavender
  accentLight: '#F2EEFF',
  accentDark: '#DCD4FF',
  accentBg: '#3D3B44', // Gentle purple-tinted shadow

  // UI Colors - Like a cozy bedroom at night
  background: '#3A3436', // Warm gray like evening walls
  surface: '#413B3D', // Slightly lighter warm gray
  surfaceHover: '#484244', // Soft interaction state
  surfaceActive: '#4F494B', // Gentle pressed state

  border: '#524A4C', // Soft rosy borders
  borderLight: '#5A5153',
  borderDark: '#484244',

  // Text Colors - Soft like evening light
  text: '#F4E8EC', // Warm white with pink undertone
  textLight: '#E4D8DC', // Slightly muted
  textLighter: '#D4C8CC', // More muted
  textDark: '#FFF0F4', // Emphasis text
  textInverse: '#3A3436', // Background color

  // State Colors - Evening versions
  success: '#88C18A', // Moonlit plant green
  successLight: '#A5D4A7',
  successDark: '#6BA86D',
  successBg: '#393F3A',

  warning: '#FFBF94', // Soft evening peach
  warningLight: '#FFD1B0',
  warningDark: '#FFAD78',
  warningBg: '#443D39',

  error: '#FFA5BA', // Evening rose
  errorLight: '#FFBDCC',
  errorDark: '#FF8DA8',
  errorBg: '#443A3D',

  info: '#A5C9FF', // Evening sky blue
  infoLight: '#BFD9FF',
  infoDark: '#8BB9FF',
  infoBg: '#393E44',
};
