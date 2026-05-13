import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          500: "#4f6bef",
          600: "#3d55d4",
          700: "#2d3fb8",
          900: "#1a2468",
        },
      },
    },
  },
  plugins: [],
};

export default config;
