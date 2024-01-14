import { saira } from '@/fonts';
import { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortButton from '@/components/SortButton';
import PageSizeButton from '@/components/PageSizeButton';
import CommunityCard from '@/components/CommunityCard';
import CommunityService from '@/services/CommunityService';

const SORT_OPTIONS = ['Alphabetical', 'Threads (High - Low)', 'Threads (Low - High)'];
const PAGE_SIZE_OPTIONS = ['10', '20', '50'];

export const metadata: Metadata = {
  title: 'Communities | Interex',
  description: 'Search for communities or create your own!',
}

export default async function CommunityFinderPage() {
  const communities = await CommunityService.getAllCommunities();

  return (
    <main className='min-h-screen'>
      {/* Banner Section */}
      <section
        className='w-full h-64 shadow-comm-banner bg-comm-banner bg-no-repeat bg-cover bg-center flex items-center justify-center gap-6 flex-col'
      >
        <h1 className={`${saira.className} text-interex-blue font-bold text-4xl`}>Discover Communities</h1>
        <SearchBar />
      </section>
      
      {/* Community Cards Section */}
      <section className='mt-6 max-w-7xl mx-auto grid grid-cols-comm-content grid-rows-comm-content'>

        {/* Sidebar */}
        <aside className='relative pr-6 col-start-1 col-end-2 row-start-2 row-end-3'>
          <div className='sticky p-4 bg-interex-category-aside top-20 shadow-comm-filter'>
            <h2 className={`${saira.className} pb-2 text-2xl font-semibold`}>Categories</h2>
            <CategoryFilter />
          </div>
        </aside>

        {/* Community Header Data */}
        <div className={`${saira.className} mb-4 col-start-2 col-end-3 whitespace-pre-line`}>
          <h2 className='font-semibold text-2xl mb-4'>10,032 Communities Found</h2>
          
          <div className='flex items-center'>
            {/* Sort Button */}
            <div className='flex gap-2 items-center mr-auto'>
              <p>Sort by</p>
              <SortButton options={SORT_OPTIONS} />
            </div>

            {/* Set items per page button */}
            <div className='flex gap-2 items-center'>
              <p>Show per page</p>
              <PageSizeButton options={PAGE_SIZE_OPTIONS} />
            </div>
          </div>

        </div>

        {/* Community Cards */}
        <ul className='h-[2000px] grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] auto-rows-max justify-items-center gap-7'>
          {communities.map((com, idx) => {
            return (
              <CommunityCard
                key={idx}
                communityId={com.id}
                name={com.name}
                numThreads={com.numThreads}
                categories={com.categories}
              />
            )
          })}
        </ul>
      </section>
    </main>
  )
}