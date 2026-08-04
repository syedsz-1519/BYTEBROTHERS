import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gallery: {
          void: '#05070a',
          wall: '#12161c',
          floor: '#0d1014',
          brass: '#c9a876',
          steel: '#4a6fa5',
          ink: '#e8e6df',
          'ink-dim': '#8b8f96',
        },
      },
      fontFamily: {
        'space-grotesk': ["'Space Grotesk'", 'sans-serif'],
        inter: ["'Inter'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      spacing: {
        '8vw': '8vw',
      },
      letterSpacing: {
        wide: '0.28em',
        wider: '0.2em',
        widest: '0.3em',
      },
    },
  },
  plugins: [],
} satisfies Config;
