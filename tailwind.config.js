/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        zks: {
          forest: '#1B4332',
          'forest-mid': '#2D5A3E',
          leaf: '#3F704D',
          mint: '#E8EFE4',
          surface: '#F6FBF5',
          container: '#F0F5F0',
          gold: '#D4AF37',
          turmeric: '#B38400',
          dark: '#191C19',
          border: '#D7DBD6',
          cold: '#0284C7',
          hot: '#D97706',
          haccp: '#16A34A',
          alert: '#DC2626',
        },
      },
      fontFamily: {
        serif: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"SF Pro"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

