/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FFF8F0",
          100: "#FFE8CC",
          200: "#FFD199",
          300: "#FFB866",
          400: "#FF9F33",
          500: "#FF9933",
          600: "#E8850F",
          700: "#C46F00",
          800: "#8F5000",
          900: "#5A3200",
          950: "#3D2200",
        },
        "bjp-green": {
          DEFAULT: "#138808",
          dark: "#0F6B06",
          light: "#1AA00A",
        },
        "bjp-navy": {
          DEFAULT: "#0A1628",
          light: "#122038",
        },
      },
      fontFamily: {
        display: ['"Segoe UI"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
