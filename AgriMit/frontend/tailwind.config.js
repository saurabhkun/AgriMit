/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        agri: {
          green:  "#22C55E",
          yellow: "#F59E0B",
          orange: "#F97316",
          red:    "#EF4444",
          dark:   "#14532D",
          leaf:   "#16A34A",
        },
      },
    },
  },
  plugins: [],
};
