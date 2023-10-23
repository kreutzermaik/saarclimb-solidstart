/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'custom-yellow': '#ecc858',
      'custom-green': '#90ba90',
      'custom-red': '#f85c5c',
      'custom-orange': '#FF8C00',
      'custom-blue': '#1b7abd',
      'custom-black': '#000',
      'custom-turquiose': 'lightseagreen',
      'custom-gold': '#FFD700',
      'custom-silver': '#C0C0C0',
      'custom-bronze': '#CD7F32',
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#2c3e50",
          "secondary": "#45607d",
          "accent": "#799FDB",
          "neutral": "#f5f5f5",
          "base-100": "#f5f5f5",
          "info": "#ecc858",
          "success": "#25a05c",
          "warning": "darkorange",
          "error": "#f85c5c",
        },
      },
    ],
  },
  plugins: [require('flowbite/plugin'), require('daisyui')]
};
