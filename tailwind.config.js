/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          "primary": "#00668A",
          "secondary": "#004E71",
          "gold": "#FFD700",
          "darkGold": "#D4AF37"
        },
      },
      fontFamily: {
        Roboto: ["Roboto, sans-serif"],
      },
      container: {
        padding: "2rem",
        center: true,
      },
    },
    plugins: [],
  }