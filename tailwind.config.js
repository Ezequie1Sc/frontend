/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        colonial: '#F6F3EB',
        wall: '#E6D6BD',
        calakmul: '#284B40',
        terracotta: '#C47D65',
        gulf: '#709B9B',
        carbon: '#262B28',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
