import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1F2123",
        sun: "#FFB51F",
        teal: "#03454D",
        jade: "#0B8562",
        cloud: "#F4F7F7",
        mist: "#EFEFEF",
      },
      fontFamily: {
        heading: ["Montserrat", "Avenir", "system-ui", "sans-serif"],
        sans: ["Avenir", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(3, 69, 77, 0.12)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
