import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'interex-nav': '#0E141B',
        'interex-brand': '#F942FD',
        'interex-blue': '#66C0F4',
        'interex-bg-black': '#040011',
        'interex-bg-blue': '#1D2F49',
        'interex-category-aside': '#050c1ba6',
        'interex-comm-card': '#0F172A99',
        'interex-light-blue': '#A6BFE352',
      },
      backgroundImage: {
        'comm-banner': "url('../assets/community-banner.png')"
      },
      boxShadow: {
        'comm-banner': '0px 8px 2px 0px rgba(0, 0, 0, 0.80)',
        'comm-searchbar': '0px 6px 4px 2px rgba(0, 0, 0, 0.60)',
        'comm-filter': '0px 4px 4px 0px rgba(0, 0, 0, 0.50)',
      },
      gridTemplateColumns: {
        'comm-content': 'minmax(250px, 300px) 1fr'
      },
      gridTemplateRows: {
        'comm-content': 'min-content 1fr'
      }
    },
  },
  plugins: [],
}

export default config
