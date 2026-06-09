/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abstract: {
          blue: '#4C5FD5',
          lavender: '#dadbf1',
          black: '#000000',
          white: '#ffffff',
          darkgray: '#1c1c1c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
