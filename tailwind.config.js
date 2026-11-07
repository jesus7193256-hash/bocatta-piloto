/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bocatta: {
          red: "#C83E31",
          redDark: "#A62E22",
          wine: "#581818",
          wineDark: "#3A0E0E",
          cream: "#F7EFEA",
          creamLight: "#FCF9F6",
          sand: "#EAD8CE",
          gold: "#D97724",
          matcha: "#5A7247",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
