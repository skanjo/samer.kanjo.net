/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}", "./src/**/*.svg"],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['"Roboto Serif"', 'serif'],
      mono: ['"Roboto Mono"', 'monospace'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
