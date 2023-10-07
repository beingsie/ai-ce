/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'bri-blue': '#2FB4FF',
        'bri-gray': '#BECED8',
        'bri-white-gray': '#F6F6F6',
      },
      dropShadow: {
        '3xl': '0 24px 40px rgba(241, 241, 241, 1)',
      },
    },
  },
  plugins: [],
}