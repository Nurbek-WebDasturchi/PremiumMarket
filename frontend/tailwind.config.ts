import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490'
        },
        ink: '#0f172a'
      },
      boxShadow: {
        glow: '0 20px 80px rgba(6, 182, 212, 0.18)'
      }
    }
  },
  plugins: []
} satisfies Config;
