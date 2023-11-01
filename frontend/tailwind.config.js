/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
=======
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms'), require('daisyui')],
  daisyui: {
    themes: ['dark']
  }
};
>>>>>>> b11a4a1 (Changed UserRegistration)
