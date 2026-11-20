/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clinical: {
          950: '#060911',
          900: '#0a0f1d',
          850: '#0e1628',
          800: '#141f36',
          700: '#1e2d4d',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(14, 165, 233, 0.4)',
          cyan: '#0ea5e9',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        'clinical-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'clinical-glow': '0 0 30px -5px rgba(14, 165, 233, 0.2)',
        'emerald-glow': '0 0 30px -5px rgba(16, 185, 129, 0.2)',
        'rose-glow': '0 0 30px -5px rgba(244, 63, 94, 0.2)',
      }
    },
  },
  plugins: [],
}
