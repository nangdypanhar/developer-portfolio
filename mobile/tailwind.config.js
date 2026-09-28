/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // app.json locks the app to light mode; NativeWind can only set the color
  // scheme manually when dark mode is class-based.
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
