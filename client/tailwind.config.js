/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D32F2F',
          redLight: '#FFEBEE',
          redDark: '#B71C1C',
          redHover: '#C62828',
          blue: '#1565C0',
          blueLight: '#E3F2FD',
          blueDark: '#0D47A1',
          grayBg: '#F5F7FA',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(211, 47, 47, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'drop-fall': 'drop 2s ease-in-out infinite',
      },
      keyframes: {
        drop: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(6px) scale(0.96)' },
        }
      }
    },
  },
  plugins: [],
};
