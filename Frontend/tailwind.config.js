/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-bg": "#f5f5f5",
        "dark-bg": "#1a202c",
        "light-text": "#333",
        "dark-text": "#f5f5f5",
      },
    },
  },
  plugins: [],
};
