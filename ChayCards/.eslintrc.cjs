/**
 * ESLint Configuration
 *
 * This configuration file sets up code linting rules for the ChayCards project,
 * ensuring consistent code style and catching potential issues early.
 */

module.exports = {
  // Base configurations we're extending
  extends: [
    // Core ESLint recommended rules
    'eslint:recommended',
    // TypeScript-specific recommended rules
    'plugin:@typescript-eslint/recommended',
    // React-specific recommended rules
    'plugin:react/recommended',
    // New JSX transform from React 17+
    'plugin:react/jsx-runtime'
  ],

  // Specify parser for TypeScript
  parser: '@typescript-eslint/parser',

  // Additional plugins
  plugins: [
    // TypeScript ESLint plugin
    '@typescript-eslint',
    // React ESLint plugin
    'react'
  ],

  // React-specific settings
  settings: {
    react: {
      // Automatically detect React version
      version: 'detect'
    }
  },

  // Custom rule configurations
  rules: {
    // Disable requirement for React import with new JSX transform
    'react/react-in-jsx-scope': 'off',
    // Allow implicit return types on functions
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Warn on explicit 'any' types instead of error
    '@typescript-eslint/no-explicit-any': 'warn'
  },

  // Environment configuration
  env: {
    // Enable browser global variables
    browser: true,
    // Enable Node.js global variables
    node: true,
    // Enable ES2021 global variables and syntax
    es2021: true
  }
}
