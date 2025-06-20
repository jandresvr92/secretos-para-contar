/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Literata', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        // Brand Colors - Official Brand Manual
        brand: {
          orange: '#FA4616',     // Naranja Primario
          white: '#FFFFFF',      // Blanco
          navy: '#002847',       // Azul Marino
        },
        // Extended palette based on brand colors
        orange: {
          50: '#FFF7F3',
          100: '#FFEDE5',
          200: '#FFD6C2',
          300: '#FFB894',
          400: '#FF8A5B',
          500: '#FA4616',        // Brand Primary Orange
          600: '#E63E14',
          700: '#C2340F',
          800: '#9F2B0C',
          900: '#82240A',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#002847',        // Brand Navy
        },
        // System colors using brand palette
        border: '#e5e7eb',
        background: '#f9fafb',
        foreground: '#002847',   // Using brand navy for text
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'brand': '0 10px 25px -3px rgba(250, 70, 22, 0.2), 0 4px 6px -2px rgba(250, 70, 22, 0.1)',
      }
    },
  },
  plugins: [],
};