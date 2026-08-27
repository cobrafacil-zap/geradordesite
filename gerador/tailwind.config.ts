import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          elev: '#111118',
          elev2: '#18181f',
        },
        fg: {
          DEFAULT: '#f5f5f7',
          muted: '#9b9ba3',
          dim: '#5a5a64',
        },
        accent: {
          DEFAULT: '#7c5cff',
          glow: '#5b8bff',
        },
        border: {
          DEFAULT: '#22222c',
          strong: '#2a2a36',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,92,255,0.25), 0 12px 40px -12px rgba(124,92,255,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 250ms cubic-bezier(0.16,1,0.3,1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(124,92,255,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(124,92,255,0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
