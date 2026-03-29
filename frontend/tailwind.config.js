/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "var(--theme-bg)",
        surface: {
          1: "var(--theme-surface-1)",
          2: "var(--theme-surface-2)",
          3: "var(--theme-surface-3)",
        },
        ink: {
          DEFAULT: "var(--theme-text-primary)",
          secondary: "var(--theme-text-secondary)",
          tertiary: "var(--theme-text-tertiary)",
          dim: "var(--theme-text-dim)",
          ghost: "var(--theme-text-ghost)",
          accent: "var(--theme-text-accent)",
        },
        todo: {
          mono: "var(--theme-todo-mono)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        "panel-mono": [
          "var(--font-panel-mono)",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        panel:
          "0 2px 4px rgba(7, 38, 2, 0.124), 0 7px 13px -3px rgba(1, 44, 9, 0.2), inset 0 -3px 0 rgba(54, 103, 66, 0.19)",
        "panel-dark":
          "0 2px 4px rgba(0, 0, 0, 0.35), 0 8px 20px -4px rgba(0, 0, 0, 0.45), inset 0 -1px 0 rgba(255, 255, 255, 0.06)",
        topbar:
          "0 0 5px -1px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
