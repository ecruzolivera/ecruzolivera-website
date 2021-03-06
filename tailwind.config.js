const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    fontFamily: {
      body: ['Ubuntu', 'sans-serif'],
      code: ['Ubuntu Mono', 'monospaced'],
    },
    extend: {
      colors: {
        primary: colors.gray[100],
        secondary: colors.gray[400],
        'bg-primary': '#181A1B',
        'bg-secondary': '#242f34',
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'hover', 'focus'],
    opacity: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
}
