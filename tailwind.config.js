/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}", "./src/**/*.svg"],
  theme: {
    extend: {
      colors: {
        ppink: "#eb0f59",
        pyellow: "",
      },
    },
  },
  plugins: [],
};
