/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1a73e8', // Primary color
          600: '#1e64d0',
          700: '#1a56b9',
          800: '#1548a1',
          900: '#0d3a89',
        },
        secondary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#34A853', // Secondary color
          600: '#2e7d32',
          700: '#1b5e20',
          800: '#133e16',
          900: '#0b2e0b',
        },
        accent: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#FBBC04', // Accent color
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        error: {
          500: '#EA4335', // Error color
        },
        success: {
          500: '#4CAF50', // Success color
        },
        warning: {
          500: '#FF9800', // Warning color
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};