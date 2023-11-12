const colors = ['blue', 'green']
const safelist = []
colors.map((x) => {
  safelist.push(`border-${x}-500`)
  safelist.push(`text-${x}-500`)
  safelist.push(`bg-${x}-200`)
  safelist.push(`bg-${x}-300`)
  safelist.push(`bg-${x}-400`)
})

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  safelist
}