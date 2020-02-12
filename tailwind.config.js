const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    fontFamily: {
      body: ['Ubuntu', 'sans-serif'],
      code: ['Ubuntu Mono', 'monospace'],
    },
    extend: {
      colors: {
        primary: colors.gray[100],
        secondary: colors.gray[200],
        'bg-primary': '#181A1B',
        'bg-secondary': '#0d0e0f',
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'hover', 'focus'],
    opacity: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
}
