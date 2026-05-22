/** @type {import('tailwindcss').Config} */
const {
  colors,
  radius,
  spacing,
  fontSize,
  letterSpacing,
  boxShadow,
} = require("./src/constants/tokens.cjs");

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      borderRadius: radius,
      spacing,
      fontSize,
      letterSpacing,
      boxShadow,
    },
  },
  plugins: [],
};
