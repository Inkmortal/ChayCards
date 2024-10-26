/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors
        primary: 'var(--chay-primary)',
        secondary: 'var(--chay-secondary)',
        accent: 'var(--chay-accent)',
        
        // UI Colors
        background: 'var(--chay-background)',
        surface: 'var(--chay-surface)',
        'surface-hover': 'color-mix(in srgb, var(--chay-surface) 90%, var(--chay-text) 10%)',
        'surface-active': 'color-mix(in srgb, var(--chay-surface) 80%, var(--chay-text) 20%)',
        border: 'var(--chay-border)',
        
        // Text Colors
        text: 'var(--chay-text)',
        'text-light': 'var(--chay-text-light)',
        'text-inverse': 'var(--chay-text-inverse)',
        
        // State Colors
        success: 'var(--chay-success)',
        warning: 'var(--chay-warning)',
        error: 'var(--chay-error)',
        info: 'var(--chay-info)',
      },
      spacing: {
        'sidebar': '280px',
      },
      backgroundColor: {
        'primary-bg': 'color-mix(in srgb, var(--chay-primary) 10%, transparent)',
      },
    },
  },
  plugins: [],
}
