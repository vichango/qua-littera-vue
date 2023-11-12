const colors = ['blue', 'green']
const whitelist = []
colors.map((x) => {
  whitelist.push(`color-${x}-200`)
  whitelist.push(`color-${x}-300`)
  whitelist.push(`color-${x}-400`)
  whitelist.push(`color-${x}-500`)
})

module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    options: {
      whitelist,
    },
  },
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}