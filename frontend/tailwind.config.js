/** @type {import('tailwindcss').Config} */
export default {
  // Mörkt papper styrs av klassen "dark" på <html>.
  // Färgerna är CSS-variabler (se index.css) och byter värde automatiskt.
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Basark
        paper: 'rgb(var(--paper) / <alpha-value>)',
        // Kort och ytor
        sand: {
          DEFAULT: 'rgb(var(--sand) / <alpha-value>)',
          deep: 'rgb(var(--sand-deep) / <alpha-value>)',
        },
        // Bläck: linjer och text
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
        },
        // Primär accent: stämpelrost
        rust: 'rgb(var(--rust) / <alpha-value>)',
        // Sekundär accent: kompassblå
        compass: 'rgb(var(--compass) / <alpha-value>)',
        // Text ovanpå rost-ytor
        onrust: 'rgb(var(--on-rust) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'ui-serif', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Skarpa, återhållsamma hörn – som ett pappersark
        ark: '6px',
      },
      boxShadow: {
        ark: '0 1px 0 0 rgb(var(--ink) / 0.05), 0 4px 10px -4px rgb(var(--ink) / 0.14)',
      },
      letterSpacing: {
        stampel: '0.14em',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Stämpeln slår ner: stor och suddig → liten överträff → på plats
        stampa: {
          '0%': { opacity: '0', transform: 'scale(1.9) rotate(-14deg)' },
          '55%': { opacity: '1', transform: 'scale(0.9) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-6deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out both',
        stampa: 'stampa 0.38s cubic-bezier(0.2, 0.9, 0.3, 1.2) both',
      },
    },
  },
  plugins: [],
};