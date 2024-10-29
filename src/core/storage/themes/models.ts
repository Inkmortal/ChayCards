export interface ThemeColors {
  // Brand Colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryBg: string;

  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  secondaryBg: string;

  accent: string;
  accentLight: string;
  accentDark: string;
  accentBg: string;

  // UI Colors
  background: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;

  border: string;
  borderLight: string;
  borderDark: string;

  // Text Colors
  text: string;
  textLight: string;
  textLighter: string;
  textDark: string;
  textInverse: string;

  // State Colors
  success: string;
  successLight: string;
  successDark: string;
  successBg: string;

  warning: string;
  warningLight: string;
  warningDark: string;
  warningBg: string;

  error: string;
  errorLight: string;
  errorDark: string;
  errorBg: string;

  info: string;
  infoLight: string;
  infoDark: string;
  infoBg: string;
}

export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  isBuiltin?: boolean;
}

export interface Theme extends ThemeMetadata {
  colors: ThemeColors;
}
