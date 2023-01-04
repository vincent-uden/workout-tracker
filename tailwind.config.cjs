/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "ibm": ["IBM Plex Sans", "sans-serif"],
        "ibm-cond": ["IBM Plex Sans Condensed", "sans-serif"],
      }
    },
  },
  plugins: [],
};
