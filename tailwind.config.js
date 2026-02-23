import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-anuphan)'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: 'hsl(var(--heroui-default-700))',

            table: {
              width: '100%',
              tableLayout: 'fixed',
              borderCollapse: 'separate',
              borderSpacing: 0,
              border: '1px solid hsl(var(--heroui-default-100))',
              overflow: 'hidden',
            },

            thead: {
              backgroundColor: 'hsl(var(--heroui-default-100))',
            },

            th: {
              padding: '0.75rem 1rem',
              fontWeight: '600',
              textAlign: 'left',
              color: 'hsl(var(--heroui-default-900))',
              borderRight: '1px solid hsl(var(--heroui-default-100))',
              borderBottom: '1px solid hsl(var(--heroui-default-100))',
            },

            td: {
              padding: '0.75rem 1rem',
              borderRight: '1px solid hsl(var(--heroui-default-100))',
              borderBottom: '1px solid hsl(var(--heroui-default-100))',
            },

            'th:last-child, td:last-child': {
              borderRight: '0',
            },
            'tbody tr:last-child td': {
              borderBottom: '0',
            },
          },
        },
      }),
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            page: '#f1f1f1',
            primary: '#ba8c25',
            secondary: '#ffffff',
            faos: {
              dark: '#1a1f14',
              'dark-soft': '#22281a',
              olive: '#556B2F',
              amber: '#f59e0b',
            },
          },
        },
        dark: {
          colors: {
            page: '#131314',
            primary: '#ba8c25',
            secondary: '#ffffff',
            faos: {
              dark: '#1a1f14',
              'dark-soft': '#22281a',
              olive: '#556B2F',
              amber: '#f59e0b',
            },
          },
        },
      },
    }),
    require('@tailwindcss/typography'),
  ],
}

module.exports = config
