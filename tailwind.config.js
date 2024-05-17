/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,tsx}", "./index.html"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "cach-l1": "#F3F3F3",
        "cach-l2": "#cbb7f7",
        "cach-l3": "#7f6afc",
        "cach-l4": "#2b2c41",
        "cach-l5": "#797979",
        "textcol-1": "#7E7A7A",
      },
    },
  },
  variant: {},
  plugins: []
  //plugins: ["prettier-plugin-tailwindcss"],
};