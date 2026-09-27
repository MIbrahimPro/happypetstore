import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1D1B16",
        paper: "#F5EFDF",
        bone: "#EAE1C9",
        red: "#D6342C",
        "red-dark": "#9E241E",
        mustard: "#E8A33D",
        sage: "#6B7A5A",
        "sage-dark": "#4C5B3E",
        slate: "#3F4A56",
        steel: "#5B6770",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "sans-serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
        stamp: ["var(--font-stamp)", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(29,27,22,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,27,22,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
    },
  },
  plugins: [],
};

export default config;
