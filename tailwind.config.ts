import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050810",
        card: "#0D1322",
        accent: "#1E9EFF",
        text: {
          primary: "#DCE3F0",
          secondary: "#9AA6BF",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(30, 158, 255, 0.4), 0 0 18px rgba(30, 158, 255, 0.35)",
        "glow-lg": "0 0 0 1px rgba(30, 158, 255, 0.5), 0 0 32px rgba(30, 158, 255, 0.45)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(30, 158, 255, 0.5), 0 0 18px rgba(30, 158, 255, 0.35)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(30, 158, 255, 0.7), 0 0 30px rgba(30, 158, 255, 0.6)",
          },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
