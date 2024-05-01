import Image from 'next/image';
import banner from '../../../assets/league-banner.png';
import icon from '../../../assets/league-icon.png';
import { saira } from '@/fonts';
import CommunityTabs from '@/components/CommunityTabs';

// FOR TESTING ========================================

const colors = {
  purple: '#9939D4',
  green: '#39D46E',
  red: '#D43939',
  yellow: '#DFE224'
}

const flairs = [
  {
    name: 'Help',
    color: colors.purple
  },
  {
    name: 'News',
    color: colors.red
  },
  {
    name: 'Skin',
    color: colors.yellow
  },
  {
    name: 'Support Main',
    color: colors.green
  },
]

// ====================================================

export default function CommunityLayout({
  params,
  children,
}: {
  params: {
    communityId: string;
  }
  children: React.ReactNode;
}) {
  return (
    <main>
      <Image className='w-full h-48 object-cover shadow-comm-banner' src={banner} alt='banner' />
      <section className='grid grid-cols-[minmax(400px,_800px)_1fr] grid-rows-[min-content_1fr] mx-auto max-w-6xl'>
        {/* Title Header */}
        <div className={`${saira.className}`}>
          <div className='flex items-center my-4'>
            <div className='w-20 rounded-full overflow-hidden border-[#093D45] border-2 shadow-comm-icon'>
              <Image className='w-[70px] m-auto' src={icon} alt='com-icon' />
            </div>
            <h1 className='text-interex-blue text-4xl font-bold ml-4'>League of Legends</h1>

            {/* Join Button */}
            <button type='button' className='ml-auto px-6 py-1 bg-[#3673AB] font-semibold text-lg rounded-lg'>
              Join
            </button>
          </div>

          {/* Tabs */}
          <CommunityTabs communityId={params.communityId} />
        </div>

        {/* Community Aside */}
        <aside className='col-start-2 col-end-3 row-start-2 row-end-3 mx-8 p-6 min-w-[250px] bg-interex-bg-thread h-min'>
          <h2 className={`${saira.className} mb-4 font-semibold text-2xl`}>About</h2>
          <p className='mb-4'>This is a community thread devoted to the game League of Legends.</p>

          {/* Creation Date. */}
          <div className='mb-4 flex items-center font-medium gap-2'>
            <svg className='w-12 h-8 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm80 64c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80z"/></svg>
            Created Apr 12, 2009
          </div>

          {/* Num Members */}
          <div className='mb-5 flex items-center font-medium gap-2'>
            <svg className='w-12 h-8 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M0 24C0 10.7 10.7 0 24 0H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 48 0 37.3 0 24zM0 488c0-13.3 10.7-24 24-24H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zM83.2 160a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM32 320c0-35.3 28.7-64 64-64h96c12.2 0 23.7 3.4 33.4 9.4c-37.2 15.1-65.6 47.2-75.8 86.6H64c-17.7 0-32-14.3-32-32zm461.6 32c-10.3-40.1-39.6-72.6-77.7-87.4c9.4-5.5 20.4-8.6 32.1-8.6h96c35.3 0 64 28.7 64 64c0 17.7-14.3 32-32 32H493.6zM391.2 290.4c32.1 7.4 58.1 30.9 68.9 61.6c3.5 10 5.5 20.8 5.5 32c0 17.7-14.3 32-32 32h-224c-17.7 0-32-14.3-32-32c0-11.2 1.9-22 5.5-32c10.5-29.7 35.3-52.8 66.1-60.9c7.8-2.1 16-3.1 24.5-3.1h96c7.4 0 14.7 .8 21.6 2.4zm44-130.4a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM321.6 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>
            12,621 Members
          </div>

          {/* Flairs */}
          <h2 className={`${saira.className} py-4 font-semibold text-2xl border-t-2 border-t-[#ffffff33]`}>Flairs</h2>
          <ul className='flex flex-wrap gap-2'>
            {flairs.map((flair, idx) => {
              return (
                <li
                  key={idx}
                  className={`font-medium text-sm text-black rounded-xl px-3 py-1`}
                  style={{ backgroundColor: `${flair.color}` }}
                >
                  {flair.name}
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Children */}
        <div className='col-start-1 col-end-2 row-start-2 row-end-3'>
          {children}
        </div>
      </section>
    </main>
  )
}
