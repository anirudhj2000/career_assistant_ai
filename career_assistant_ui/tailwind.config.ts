import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    keyframes: {
      slideUp: {
        "0%": { opacity: "0.5", transform: "translateY(5vh)" },

        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
    animation: {
      slideUp: "slideUp 0.5s ease-in-out",
    },
  },
  plugins: [],
};
export default config;
