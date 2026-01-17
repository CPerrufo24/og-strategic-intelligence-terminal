/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        oil: {
          navy: '#0A192F',
          gold: '#C5A059',
          dark: '#050C16',
          light: '#F4F7F6'
        },
        status: {
          success: '#27AE60',
          danger: '#E74C3C',
          warning: '#F1C40F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        condensed: ['Roboto Condensed', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
