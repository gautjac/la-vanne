/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // La Vanne — a late-night comedy club. Deep red velvet, brick, chrome,
        // hot amber spotlight, neon red & cyan signage.
        night: {
          DEFAULT: "#120608", // near-black plum
          deep: "#0b0405",
          panel: "#1c0c0f",
          raise: "#261215",
        },
        brick: {
          DEFAULT: "#5a2226",
          dark: "#3d1417",
          mortar: "#2a1012",
        },
        velvet: {
          DEFAULT: "#7a1320",
          dark: "#4d0c15",
          light: "#a01f2d",
        },
        amber: {
          DEFAULT: "#e8c45a", // spotlight gold
          hot: "#f4b73a",
          glow: "#ffe6a0",
          dim: "#9c8338",
        },
        chrome: {
          DEFAULT: "#c9ccd1",
          dark: "#8a8e95",
          light: "#eef0f3",
        },
        neon: {
          red: "#ff2d3f",
          cyan: "#2ee6e6",
          pink: "#ff5db1",
        },
        cream: "#f3e8d6",
      },
      fontFamily: {
        display: ['"Anton"', "Impact", "sans-serif"],
        marquee: ['"Bebas Neue"', "Impact", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        spot: "0 0 80px 20px rgba(232,196,90,0.28)",
        "spot-sm": "0 0 40px 8px rgba(232,196,90,0.25)",
        neon: "0 0 6px rgba(255,45,63,0.9), 0 0 18px rgba(255,45,63,0.6)",
        "neon-cyan": "0 0 6px rgba(46,230,230,0.9), 0 0 18px rgba(46,230,230,0.5)",
        chrome: "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.6)",
        card: "0 10px 30px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "brick-wall":
          "linear-gradient(rgba(18,6,8,0.86), rgba(11,4,5,0.94)), repeating-linear-gradient(0deg, #2a1012 0px, #2a1012 2px, transparent 2px, transparent 42px), repeating-linear-gradient(90deg, #5a2226 0px, #5a2226 80px, #2a1012 80px, #2a1012 84px)",
        "velvet-curtain":
          "repeating-linear-gradient(90deg, #4d0c15 0px, #7a1320 28px, #4d0c15 56px)",
        "spot-cone":
          "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,230,160,0.22), rgba(255,230,160,0.06) 45%, transparent 70%)",
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        buzz: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-1px) rotate(-0.4deg)" },
          "75%": { transform: "translateX(1px) rotate(0.4deg)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        spotSway: {
          "0%, 100%": { transform: "translateX(-3%) rotate(-1deg)" },
          "50%": { transform: "translateX(3%) rotate(1deg)" },
        },
      },
      animation: {
        riseIn: "riseIn 0.45s ease-out both",
        flicker: "flicker 4s linear infinite",
        buzz: "buzz 0.18s ease-in-out 3",
        pulse2: "pulse2 1.6s ease-in-out infinite",
        spotSway: "spotSway 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
