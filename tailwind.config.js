/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: 'var(--chay-primary)',
        'primary-light': 'var(--chay-primary-light)',
        'primary-dark': 'var(--chay-primary-dark)',
        'primary-bg': 'var(--chay-primary-bg)',
        
        secondary: 'var(--chay-secondary)',
        'secondary-light': 'var(--chay-secondary-light)',
        'secondary-dark': 'var(--chay-secondary-dark)',
        'secondary-bg': 'var(--chay-secondary-bg)',
        
        accent: 'var(--chay-accent)',
        'accent-light': 'var(--chay-accent-light)',
        'accent-dark': 'var(--chay-accent-dark)',
        'accent-bg': 'var(--chay-accent-bg)',

        // UI Colors
        background: 'var(--chay-background)',
        surface: 'var(--chay-surface)',
        'surface-hover': 'var(--chay-surface-hover)',
        'surface-active': 'var(--chay-surface-active)',
        border: 'var(--chay-border)',
        'border-light': 'var(--chay-border-light)',
        'border-dark': 'var(--chay-border-dark)',

        // Text Colors
        text: 'var(--chay-text)',
        'text-light': 'var(--chay-text-light)',
        'text-lighter': 'var(--chay-text-lighter)',
        'text-dark': 'var(--chay-text-dark)',
        'text-inverse': 'var(--chay-text-inverse)',

        // State Colors
        success: 'var(--chay-success)',
        warning: 'var(--chay-warning)',
        error: 'var(--chay-error)',
        info: 'var(--chay-info)',
      },
    },
  },
  plugins: [],
}
