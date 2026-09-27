import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B0B0C",
        bone: "#FAF6EE",
        collar: "#E12D20",
        collardeep: "#B31F14",
        turf: "#2FA05A",
        amber: "#F2A83B",
        smoke: "#8A8378",
      },
      fontFamily: {
        display: ["var(--font-display)", "Trebuchet MS", "sans-serif"],
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        round: ["var(--font-round)", "Verdana", "sans-serif"],
      },
      borderRadius: {
        blob: "2rem",
      },
      boxShadow: {
        soft: "0 12px 32px rgba(11, 11, 12, 0.10)",
        softer: "0 6px 18px rgba(11, 11, 12, 0.08)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.2deg)" },
          "50%": { transform: "rotate(1.2deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        tailwig: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(6deg)" },
          "75%": { transform: "rotate(-6deg)" },
        },
      },
      animation: {
        breathe: "breathe 5s ease-in-out infinite",
        sway: "sway 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        tailwig: "tailwig 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
