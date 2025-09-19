/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.{css}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        base: {
          bg: "hsl(240 10% 7%)",
          card: "hsl(240 10% 10%)",
          border: "hsl(240 10% 18%)",
          text: "hsl(0 0% 98%)",
          mut: "hsl(0 0% 70%)"
        },
        brand: {
          500: "#5b8cff",
          600: "#4c7af2",
          700: "#4067d9"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.35)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      }
    }
  },
  plugins: []
};
