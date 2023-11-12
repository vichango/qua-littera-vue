const colors = ['blue', 'green']
const whitelist = []
colors.map((x) => {
  whitelist.push(`border-${x}-500`)
  whitelist.push(`text-${x}-500`)
  whitelist.push(`bg-${x}-200`)
  whitelist.push(`bg-${x}-300`)
  whitelist.push(`bg-${x}-400`)
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