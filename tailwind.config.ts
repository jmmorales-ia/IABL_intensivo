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
    },
  },
  plugins: [],
};

export default config;
