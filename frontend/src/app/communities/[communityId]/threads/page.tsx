import SortButton from '@/components/SortButton';
import ThreadCard from '@/components/ThreadCard';
import { saira } from '@/fonts';
import ThreadService from '@/services/ThreadService';

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
  const threads = await ThreadService.getAllThreads(params.communityId);
  return (
    <section>
      {/* Header */}
      <div className={`${saira.className} flex justify-between items-center my-4`}>
        <h2 className='text-xl font-semibold'>{threads.length} Threads</h2>
        <div className='flex items-center gap-2'>
          <p>Sort by</p>
          <SortButton options={SORT_OPTIONS} />
        </div>
      </div>

      {/* Threads List */}
      <ul>
        {threads.map((thread) => {
          return (
            <ThreadCard
              key={thread.id}
              details={thread}
            />
          )
        })}
      </ul>
    </section>
  )
}
