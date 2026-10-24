/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#E8EEF7',
        surface: '#EDF2FA',
        card: '#EDF2FA',
        textPrimary: '#263449',
        textSecondary: '#7E8CA2',
        muted: '#7E8CA2',
        primary: {
          DEFAULT: '#51BFA2',
          hover: '#43ab8f',
          light: '#E2F6F1',
        },
        secondary: {
          DEFAULT: '#8D91E8',
          hover: '#797dd6',
          light: '#ECEEFA',
        },
        accentPink: '#E7A7CB',
        warning: '#E7B35F',
        danger: '#E77F91',
        border: 'rgba(203, 211, 223, 0.5)',
      },
      boxShadow: {
        'neu-card': '7px 7px 16px #cbd3df, -7px -7px 16px #ffffff',
        'neu-card-hover': '9px 9px 20px #c4cddc, -9px -9px 20px #ffffff',
        'neu-flat': '4px 4px 10px #cbd3df, -4px -4px 10px #ffffff',
        'neu-sm': '3px 3px 8px #cbd3df, -3px -3px 8px #ffffff',
        'neu-inset': 'inset 3px 3px 6px #cbd3df, inset -3px -3px 6px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 4px #cbd3df, inset -2px -2px 4px #ffffff',
        'neu-pressed': 'inset 2px 2px 5px #cbd3df, inset -2px -2px 5px #ffffff',
        'neu-accent': '4px 4px 12px rgba(81, 191, 162, 0.35), -4px -4px 10px #ffffff',
        'neu-secondary': '4px 4px 12px rgba(141, 145, 232, 0.35), -4px -4px 10px #ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
