import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#071b21",
        lagoon: "#0e4f5c",
        aqua: "#4ddac5",
        foam: "#dff8f2",
        ink: "#102025"
      }
    }
  },
  plugins: []
};

export default config;
