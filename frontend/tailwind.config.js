/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep organic pine-bark/forest-charcoal background colors
        dark: {
          50: '#f4f6f5',
          100: '#e5eae7',
          200: '#ccd6d0',
          300: '#a3b8ad',
          400: '#759483',
          500: '#537563',
          600: '#3f5a4a',
          700: '#32483b',
          800: '#233229',
          900: '#111b15', // Main deep dark background
          950: '#070b09',
        },
        // Forest Sage & Emerald Green (representing recycling and bio-materials)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warm Terracotta & Clay (representing natural dyes, cotton fibers, and warmth)
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdbb74',
          400: '#fb923c',
          500: '#f97316', // Terracotta
          600: '#ea580c',
          705: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Gold Ochre & Sand (representing quality linen, silk, and raw resources)
        accent: {
          50: '#fefbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Gold Ochre
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 27, 21, 0.5)',
        'glow-primary': '0 0 15px 2px rgba(16, 185, 129, 0.15)',
        'glow-secondary': '0 0 15px 2px rgba(249, 115, 22, 0.15)',
      }
    },
  },
  plugins: [],
}
