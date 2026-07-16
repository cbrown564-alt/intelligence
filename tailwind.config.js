/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07070b',
        'ink-2': '#0b0b12',
        paper: 'rgb(237 231 218 / <alpha-value>)',
        sand: 'rgb(232 179 106 / <alpha-value>)',
        'violet-glow': 'rgb(184 173 255 / <alpha-value>)',
        sea: 'rgb(134 228 202 / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
