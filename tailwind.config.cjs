/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app.html',
    './src/**/*.svelte',
  ],
  theme: {
    extend: {
      fontFamily: {
        'icon': 'Material Icons',
        'icon-outlined': 'Material Icons Outlined',
      },
    },
  },
}
