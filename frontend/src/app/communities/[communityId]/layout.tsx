import Image from 'next/image';
import banner from '../../../assets/league-banner.png';
import icon from '../../../assets/league-icon.png';
import { saira } from '@/fonts';
import CommunityTabs from '@/components/CommunityTabs';

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
        <aside className='col-start-2 col-end-3 row-start-2 row-end-3'>
          ASIDE
        </aside>

        {/* Children */}
        <div className='col-start-1 col-end-2 row-start-2 row-end-3'>
          {children}
        </div>
      </section>
    </main>
  )
}
