
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js}",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        golden: "#FBBF24",
      },
    },
  },
  plugins: [],
}