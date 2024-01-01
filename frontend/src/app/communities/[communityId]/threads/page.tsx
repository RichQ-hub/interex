import SortButton from '@/components/SortButton';
import ThreadCard from '@/components/ThreadCard';
import { threads } from '@/data/threads';
import { saira } from '@/fonts';

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
      <div className={`${saira.className} flex justify-between items-center mb-4`}>
        <h2 className='text-xl font-semibold'>6,923 Threads</h2>
        <div className='flex items-center gap-2'>
          <p>Sort by</p>
          <SortButton options={SORT_OPTIONS} />
        </div>
      </div>

      {/* Threads List */}
      <ul>
        {threads.map((thread, idx) => {
          return (
            <ThreadCard
              key={idx}
              id={thread.id}
              communityId={params.communityId}
              name={thread.name}
              author={thread.author}
              postedOn={thread.postedOn}
              numComments={thread.numComments}
              numUpvotes={thread.numUpvotes}
              flairs={thread.flairs}
            />
          )
        })}
      </ul>
    </section>
  )
}
