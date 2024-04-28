import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/skeletons/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'interex-nav': '#0E141B',
        'interex-brand': '#F942FD',
        'interex-blue': '#66C0F4',
        'interex-blue-light': '#66c0f467',
        'interex-bg-black': '#040011',
        'interex-bg-blue': '#1D2F49',
        'interex-category-aside': '#050c1ba6',
        'interex-comm-card': '#0F172A80',
        'interex-light-blue': '#A6BFE352',
        'interex-bg-thread': '#0F172A99',
        'interex-aqua': '#10F0F0',
        'interex-input': '#A6BFE326',
        'interex-owner': '#FFF50C',
        'interex-admin': '#FF41F7',
        'interex-moderator': '#FF0C0C',
      },
      backgroundImage: {
        'comm-banner': "url('../assets/community-banner.png')"
      },
      boxShadow: {
        'comm-banner': '0px 8px 2px 0px rgba(0, 0, 0, 0.80)',
        'comm-icon': '0px 4px 4px 0px rgba(0, 0, 0, 0.70)',
        'comm-searchbar': '0px 6px 4px 2px rgba(0, 0, 0, 0.60)',
        'comm-filter': '0px 4px 4px 0px rgba(0, 0, 0, 0.50)',
        'comm-card': '0px 5px 10px 0px #000',
        'comm-card-hover': '0 8px 16px 3px #000',
        'thread-card-hover': '-6px 8px 2px 0px rgba(165, 199, 218, 0.30)',
      },
      gridTemplateColumns: {
        'comm-content': 'minmax(250px, 300px) 1fr'
      },
      gridTemplateRows: {
        'comm-content': 'min-content 1fr'
      },
    },
  },
  plugins: [],
}

export default config
