/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })]
}

module.exports = config
