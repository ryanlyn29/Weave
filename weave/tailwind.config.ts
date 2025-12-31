import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Solid colors only - no gradients
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      borderRadius: {
        // Bubbly but restrained
        'bubble': '12px',
        'bubble-lg': '16px',
        'bubble-xl': '20px',
      },
      fontSize: {
        // Small typography with good proportions
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['13px', { lineHeight: '18px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'md': ['15px', { lineHeight: '22px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '26px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
      },
      spacing: {
        'hairline': '1px',
      },
    },
  },
  plugins: [],
  // Disable shadows globally
  corePlugins: {
    boxShadow: false,
  },
}
export default config

