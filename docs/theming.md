# ChayCards Theming System

## Overview

ChayCards features a comprehensive theming system that allows for complete customization of the application's appearance. The system supports both built-in themes and custom user-created themes.

## Theme Structure

Each theme consists of:

```typescript
interface Theme {
  id: string;          // Unique identifier
  name: string;        // Display name
  description: string; // Brief description
  author: string;      // Theme creator
  version: string;     // Theme version
  isBuiltin?: boolean; // Whether it's a built-in theme
  colors: ThemeColors; // Color definitions
}
```

### Color System

The color system is organized into several categories:

```typescript
interface ThemeColors {
  // Brand Colors
  primary: string;      // Main brand color
  primaryLight: string; // Lighter variant
  primaryDark: string;  // Darker variant
  primaryBg: string;    // Background tint
  
  // UI Colors
  background: string;    // Main background
  surface: string;      // Component background
  surfaceHover: string; // Hover state
  surfaceActive: string;// Active state
  
  // Text Colors
  text: string;         // Primary text
  textLight: string;    // Secondary text
  textInverse: string;  // Text on dark backgrounds
  
  // State Colors
  success: string;      // Success states
  warning: string;      // Warning states
  error: string;        // Error states
  info: string;         // Information states
}
```

## Built-in Themes

ChayCards comes with two built-in themes:

1. **Default Theme**: A light theme with blue accents
2. **Dracula Theme**: A dark theme based on the Dracula color scheme

## Theme Management

### Selecting Themes

1. Go to Settings > Appearance
2. Click on the current theme to open the theme browser
3. Browse available themes by category (All, Built-in, Custom)
4. Click on a theme to apply it

### Creating Custom Themes (Coming Soon)

Users will be able to:
- Create new themes from scratch
- Duplicate and modify existing themes
- Import themes from JSON files
- Export themes to share with others

### Theme Format

Themes are stored in JSON format:

```json
{
  "id": "custom-theme",
  "name": "My Custom Theme",
  "description": "A custom theme with purple accents",
  "author": "User Name",
  "version": "1.0.0",
  "colors": {
    "primary": "#6b46c1",
    // ... other color definitions
  }
}
```

## Theme Development

### Best Practices

1. **Color Relationships**
   - Use `primaryLight` and `primaryDark` for interactive states
   - Ensure sufficient contrast between text and background colors
   - Use `textLight` for secondary information
   - Use `surface` for component backgrounds
   - Use state colors consistently for feedback

2. **Accessibility**
   - Maintain WCAG 2.1 AA contrast ratios
   - Test themes with color blindness simulators
   - Provide high contrast alternatives
   - Use semantic color names in code

3. **Color Variations**
   - Create consistent light/dark variants
   - Use opacity for subtle variations
   - Keep color relationships consistent
   - Test in different lighting conditions

### Testing Themes

1. **Visual Testing**
   ```typescript
   // Test all components with the theme
   const theme = createTheme({...});
   applyTheme(theme);
   
   // Check contrast ratios
   function checkContrast(color1: string, color2: string): boolean {
     // Implement contrast ratio calculation
     return contrastRatio >= 4.5; // WCAG AA standard
   }
   ```

2. **Component Testing**
   - Test interactive states (hover, focus, active)
   - Verify color inheritance
   - Check border and shadow visibility
   - Test with different content lengths

### Theme Migration

When updating themes between versions:

1. **Version Control**
   ```json
   {
     "version": "1.1.0",
     "migrations": [
       {
         "from": "1.0.0",
         "transform": "Add primaryBg color"
       }
     ]
   }
   ```

2. **Backward Compatibility**
   - Provide fallback colors
   - Migrate old themes automatically
   - Document breaking changes
   - Support theme version checking

## Plugin Integration

Plugins automatically inherit the current theme through CSS variables:

```css
.plugin-component {
  /* Base styles */
  color: var(--chay-text);
  background: var(--chay-surface);
  border-color: var(--chay-border);

  /* Interactive states */
  &:hover {
    background: var(--chay-surface-hover);
  }

  &:active {
    background: var(--chay-surface-active);
  }

  /* Feedback states */
  &.success {
    color: var(--chay-success);
    background: var(--chay-success-bg);
  }
}
```

### Plugin Theme Guidelines

1. **Use Theme Variables**
   - Always use CSS variables for colors
   - Follow the semantic naming convention
   - Test with multiple themes
   - Support high contrast modes

2. **Component Design**
   - Make components theme-aware
   - Use relative colors
   - Support dark and light modes
   - Handle theme transitions

3. **Performance**
   - Minimize theme-related calculations
   - Cache computed styles
   - Use CSS variables efficiently
   - Handle theme changes smoothly

## Future Enhancements

- Theme editor with live preview
- Theme marketplace for sharing
- High contrast and color-blind friendly themes
- Theme import/export functionality
- Theme version management
- Theme hot-reloading for development

## Contributing

To contribute new themes:

1. Fork the repository
2. Create your theme following the format
3. Test with different content types
4. Submit a pull request
5. Include theme preview images
6. Document any special features

## Resources

- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG Color Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Color Theory Basics](https://material.io/design/color/the-color-system.html)
