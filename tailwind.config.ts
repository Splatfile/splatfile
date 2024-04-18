import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "7/2": "7 / 2",
        "9/16": "9 / 16",
        "4/5": "4 / 5",
      },
      keyframes: {
        slideUpFull: {
          from: {
            transform: "translateY(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideUp: {
          from: {
            transform: "translateY(20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideLeft: {
          from: {
            transform: "translateX(20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideLeftFull: {
          from: {
            transform: "translateY(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideRight: {
          from: {
            transform: "translateX(-20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideRightFull: {
          from: {
            transform: "translateY(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-up-full": "slideUpFull 0.5s ease-out forwards",
        "slide-left": "slideLeft 0.5s ease-out forwards",
        "slide-left-full": "slideLeftFull 0.5s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "slide-right-full": "slideRightFull 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
