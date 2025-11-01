/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // Quét tất cả file JS/TSX trong src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}