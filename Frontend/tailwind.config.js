export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ea2a33",
        "background-light": "#f8f6f6",
        "background-dark": "#0a0505",
        "surface-dark": "#1a0f0f",
        "border-dark": "#2d1a1a",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}