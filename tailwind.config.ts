import type { Config } from "tailwindcss";

// TIDAK TERPAKAI — Tailwind v4 membaca token dari @theme di src/app/globals.css.
// File ini dipertahankan agar referensi components.json tidak rusak; jangan tambah token di sini.
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0e",
          subtle: "#12121a",
        },
        fg: {
          primary: "#e8e6e3",
          muted: "#6b6b7b",
        },
        accent: {
          terracotta: "#c46200",
        },
        border: "#3a3a4a",
        paper: {
          DEFAULT: "#ede8dc",
          deep: "#e2dccb",
        },
        ink: "#1a1e1a",
        seal: {
          DEFAULT: "#1d4d3b",
          subtle: "rgba(29, 77, 59, 0.1)",
        },
        rule: "#c9c2b2",
        cap: "#6e6a5e",
        signal: "#a63a2e",
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["Geist Sans", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      lineHeight: {
        tight: "1.25",
        base: "1.6",
        relaxed: "1.75",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "0.05em",
        wide: "0.2em",
      },
    },
  },
  plugins: [],
} satisfies Config;