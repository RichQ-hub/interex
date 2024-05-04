import SortButton from '@/components/SortButton';
import ThreadsList from '@/components/ThreadsList';
import { saira } from '@/fonts';
import { Suspense } from 'react';

const SORT_OPTIONS = [
  'Alphabetical',
  'Latest',
  'Oldest',
  'Comments (Low - High)',
  'Comments (High - Low)'
]

export default async function CommunityThreadsPage({
  params,
}: {
  params: {
    communityId: string;
  }
}) {
  return (
    <section>
      {/* Header */}
      <div className={`${saira.className} flex justify-between items-center my-4`}>
        <h2 className='text-xl font-semibold'>6,923 Threads</h2>
        <div className='flex items-center gap-2'>
          <p>Sort by</p>
          <SortButton options={SORT_OPTIONS} />
        </div>
      </div>

      {/* Threads List */}
      <Suspense fallback={<h2>Loading...</h2>}>
        <ThreadsList communityId={params.communityId} />
      </Suspense>
    </section>
  )
}
