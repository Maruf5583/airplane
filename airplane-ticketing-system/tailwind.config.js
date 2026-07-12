/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // existing brand colors — keep as is, used by btn-primary/btn-secondary etc.
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c',
        },

        // new — for the redesigned home page only
        emerald: {
          DEFAULT: '#0B6E4F',
          dark: '#073F2C',
        },
        sky: {
          DEFAULT: '#1E7FCB',
        },
        gold: {
          DEFAULT: '#F2B705',
        },
        crimson: {
          DEFAULT: '#E8434F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatPlane: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(6px) translateY(-4px)' },
        },
        dashMove: {
          to: { strokeDashoffset: -40 },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'float-plane': 'floatPlane 3s ease-in-out infinite',
        'dash-move': 'dashMove 2s linear infinite',
      },
    },
  },

  keyframes: {
  fadeUp: {
    '0%': { opacity: 0, transform: 'translateY(24px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  floatPlane: {
    '0%, 100%': { transform: 'translateX(0) translateY(0)' },
    '50%': { transform: 'translateX(6px) translateY(-4px)' },
  },
  dashMove: {
    to: { strokeDashoffset: -40 },
  },
  slideDown: {
    '0%': { opacity: 0, transform: 'translateY(-8px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  slideInRight: {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' },
  },
},
animation: {
  'fade-up': 'fadeUp 0.7s ease-out both',
  'float-plane': 'floatPlane 3s ease-in-out infinite',
  'dash-move': 'dashMove 2s linear infinite',
  'slide-down': 'slideDown 0.2s ease-out both',
  'slide-in-right': 'slideInRight 0.3s ease-out both',
},
  plugins: [],
}