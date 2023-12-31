import SortButton from '@/components/SortButton';
import { saira } from '@/fonts';

const SORT_OPTIONS = [
  'Alphabetical',
  'Latest',
  'Oldest',
  'Comments (Low - High)',
  'Comments (High - Low)'
]

export default async function CommunityThreadsPage() {
  return (
    <section>
      {/* Header */}
      <div className={`${saira.className} flex items-center justify-between`}>
        <h2 className='text-xl font-semibold'>6,923 Threads</h2>
        <div className='flex items-center gap-2'>
          <p>Sort by</p>
          <SortButton options={SORT_OPTIONS} />
        </div>
      </div>

      {/* Threads List */}
    </section>
  )
}
