import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 400: '#60a5fa',
          500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
        },
        sidebar: { DEFAULT: '#17308f', hover: '#1e3fb0', active: '#2f6bf0', muted: '#9fb5ef', border: '#2c47a0' },
        surface: { DEFAULT: '#f4f7fd', card: '#ffffff', line: '#e8edf5' },
        ink: { DEFAULT: '#0f172a', soft: '#334155', muted: '#64748b', faint: '#94a3b8' }
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 2px 8px -2px rgba(16,24,40,.06)',
        pop: '0 18px 40px -16px rgba(23,48,143,.28)'
      },
      borderRadius: { xl: '0.875rem', '2xl': '1rem' }
    }
  },
  plugins: []
} satisfies Config
