/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { fontFamily: { body: ["var(--font-body)", "sans-serif"], display: ["var(--font-display)", "sans-serif"] } } },
  plugins: [],
};
