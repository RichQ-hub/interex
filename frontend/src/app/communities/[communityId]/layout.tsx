import Image from 'next/image';
import banner from '../../../assets/league-banner.png';
import icon from '../../../assets/league-icon.png';
import { saira } from '@/fonts';
import CommunityTabs from '@/components/CommunityTabs';
import { Suspense } from 'react';
import CommunityTitle from '@/components/CommunityTitle';
import CommunityAside from '@/components/CommunityAside';
import Link from 'next/link';

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

            <Suspense fallback={<h1>Loading...</h1>}>
              <CommunityTitle communityId={params.communityId}/>
            </Suspense>

            {/* Create Post Button */}
            <Link
              href={`/communities/${params.communityId}/threads/create`}
              className='px-6 py-1 ml-auto outline outline-1 outline-white font-medium rounded-full hover:bg-slate-600'
            >
              + Create New Thread
            </Link>

            {/* Join Button */}
            <button type='button' className='px-6 py-1 ml-4 bg-[#3673AB] font-semibold text-lg rounded-lg hover:opacity-80'>
              Join
            </button>
          </div>

          {/* Tabs */}
          <CommunityTabs communityId={params.communityId} />
        </div>

        {/* Community Aside */}
        <aside className='col-start-2 col-end-3 row-start-2 row-end-3 mx-8 p-6 min-w-[250px] bg-interex-bg-thread h-min'>
          <Suspense fallback={<h2>Loading...</h2>}>
            <CommunityAside communityId={params.communityId}/>
          </Suspense>
        </aside>

        {/* Children */}
        <div className='col-start-1 col-end-2 row-start-2 row-end-3'>
          {children}
        </div>
      </section>
    </main>
  )
}
