// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
    ],
  },
}





















































// /** @type {import('tailwindcss').Config} */
// export default {
 
//   content: [
//     './index.html',
//     './src/**/*.{js,ts,jsx,tsx}',
//   ],
 
//   theme: {
//     extend: {
//       fontFamily: {
//         nunito: ['"Nunito"', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// };