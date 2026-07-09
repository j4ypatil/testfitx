/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#a1a1a6',
        'accent-hover': '#c7c7cc',
        'dark-bg': '#121212',
        'dark-card': '#1c1c1e',
        'dark-border': '#38383a',
        'dark-muted': '#98989d',
        foreground: '#f5f5f7',
        'light-bg': '#121212',
        'light-card': '#1c1c1e',
        'light-border': '#38383a',
        'light-muted': '#98989d',
        'macro-protein': '#ff4d4d',
        'macro-carbs': '#ff9f0a',
        'macro-fats': '#0a84ff',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
