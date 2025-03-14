/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
      inset: {
        "2px": "2px",
      },
      fontFamily: {
        vivaldi: ["Vivaldi", "cursive"],
        dancingScript: ["Dancing Script", "cursive"],
      },
    },
  },
  plugins: [],
};
