/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F14',
        card: '#16161E',
        primary: '#10B981', // emerald
        secondary: '#8B5CF6', // violet
        textPrimary: '#F1F1F3',
        muted: '#6B7280',
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
