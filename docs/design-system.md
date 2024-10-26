# ChayCards Design System

## Core Color Variables

### Main Color Palette
These are the primary colors used throughout the application:

```css
:root {
  /* Core Brand Colors */
  --chay-primary: #0ea5e9;      /* Main brand color */
  --chay-secondary: #64748b;    /* Secondary brand color */
  --chay-accent: #d946ef;       /* Accent for highlights */
  
  /* UI Colors */
  --chay-background: #ffffff;    /* Main background */
  --chay-surface: #f8f9fa;      /* Card/component background */
  --chay-border: #e2e8f0;       /* Borders and dividers */
  
  /* Text Colors */
  --chay-text: #1e293b;         /* Primary text */
  --chay-text-light: #64748b;   /* Secondary/helper text */
  --chay-text-inverse: #ffffff; /* Text on dark backgrounds */
  
  /* State Colors */
  --chay-success: #22c55e;      /* Success states */
  --chay-warning: #f59e0b;      /* Warning states */
  --chay-error: #ef4444;        /* Error states */
  --chay-info: #3b82f6;         /* Information states */
}
```

## Extending the Color System

### Adding New Variables
To add new color variables:

1. Document the new variable in this file
2. Add it to the `:root` selector in `styles.css`
3. Update the theme interfaces in `types/theme.ts`

Example:
```css
/* New Variable Template */
--chay-new-color: #hexcode;    /* Description of usage */
```

### Usage in Components
Components should use semantic variable names:

```css
.button {
  background: var(--chay-primary);
  color: var(--chay-text-inverse);
}

.card {
  background: var(--chay-surface);
  border: 1px solid var(--chay-border);
}
```

## Plugin Integration

### Using Variables in Plugins
Plugins can access all color variables:

```typescript
const PluginComponent = styled.div`
  background: var(--chay-surface);
  color: var(--chay-text);
  border: 1px solid var(--chay-border);
`;
```

### Adding Plugin-Specific Colors
If a plugin needs custom colors:

1. Prefix with plugin name
2. Document in plugin's README
3. Add to the theme customization interface

Example:
```css
/* In plugin styles */
--chay-myplugin-special: #hexcode;
```

## Theme Customization

### Basic Theme Interface
```typescript
interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  // ... other core colors
}
```

### Theme Switching
Themes change variable values:

```css
.theme-dark {
  --chay-background: #1a1a1a;
  --chay-surface: #2d2d2d;
  --chay-text: #ffffff;
  /* ... other dark theme values */
}
```

## Documentation Guidelines

When adding new color variables:

1. Purpose
   - What is this color used for?
   - Why is it needed?

2. Usage
   - Where should it be used?
   - Any specific components?

3. Accessibility
   - Contrast requirements
   - Dark mode considerations

Example Documentation:
```markdown
### New Color Variable
--chay-new-color: #hexcode

Purpose: Used for special state indicators
Usage: In notification components
Accessibility: Meets WCAG AA contrast with background
```

## Best Practices

1. Use Semantic Names
   - Name variables by purpose, not color
   - Example: `--chay-warning` not `--chay-orange`

2. Maintain Consistency
   - Use existing variables when possible
   - Create new variables only when needed

3. Plugin Development
   - Use core variables first
   - Create custom variables only for unique needs

4. Documentation
   - Keep this file updated
   - Document all new variables
   - Include usage examples

## Future Additions

To request new color variables:

1. Open an issue describing:
   - Purpose of new color
   - Where it will be used
   - Why existing colors don't work

2. Include in PR:
   - Variable addition to this doc
   - Implementation in styles
   - Usage examples
