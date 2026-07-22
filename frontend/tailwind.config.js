/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blood': '#8B0000',
        'blood-light': '#A52A2A',
        'blood-dark': '#4A0000',
        'fire': '#FF4500',
        'fire-light': '#FF6B35',
        'dark': '#0D0D0D',
        'dark-light': '#1A1A1A',
        'dark-lighter': '#2D2D2D',
        'bone': '#F5F5F0',
        'bone-dark': '#E8E8E0',
        'poison': '#39FF14',
        'poison-dark': '#2ECC71',
      },
      fontFamily: {
        'creepster': ['Creepster', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 2s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
