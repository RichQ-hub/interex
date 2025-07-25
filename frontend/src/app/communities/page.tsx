import { saira } from '@/fonts';
import { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortButton from '@/components/SortButton';
import PageSizeButton from '@/components/PageSizeButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Suspense } from 'react';
import CommunitiesList from '@/components/CommunitiesList';
import CommunitiesListSkeleton from '@/skeletons/CommunitiesListSkeleton';
import CategoryFilterSkeleton from '@/skeletons/CategoryFilterSkeleton';
import AddCommunityButton from '@/components/AddCommunityButton';
import CreateCommunityModal from '@/components/CreateCommunityModal';
import CreateCategoryModal from '@/components/CreateCategoryModal';
import AddCategoryButton from '@/components/AddCategoryButton';

const SORT_OPTIONS = ['Alphabetical', 'Threads (High - Low)', 'Threads (Low - High)'];
const PAGE_SIZE_OPTIONS = ['10', '20', '50'];

export const metadata: Metadata = {
  title: 'Communities | Interex',
  description: 'Search for communities or create your own!',
}

export default async function CommunityFinderPage({
  searchParams
}: {
  searchParams?: {
    query?: string;
    sortBy?: string;
    pageSize?: string;
    page?: string;
    category?: string[] | string;
    createCommunityModal?: string;
    createCategoryModal?: string;
  }
}) {
  const session = await getServerSession(authOptions);

  const query = searchParams?.query || '';
  const sortBy = searchParams?.sortBy || '';
  const pageSize = searchParams?.pageSize || '';
  const page = searchParams?.page || '';
  const category = searchParams?.category ?? '';

  return (
    <main>
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
            {/* Sidebar Header */}
            <div className='mb-2 flex items-center'>
              <h2 className={`${saira.className} text-2xl font-semibold`}>Categories</h2>
              {
                session &&
                <AddCategoryButton />
              }
            </div>
            <Suspense fallback={<CategoryFilterSkeleton />}>
              <CategoryFilter />
            </Suspense>
          </div>
        </aside>

        {/* Community Header Data */}
        <div className={`${saira.className} mb-4 col-start-2 col-end-3 whitespace-pre-line`}>
          {/* Top Header */}
          <div className='flex items-center mb-4'>
            <h2 className='font-semibold text-2xl'>10,032 Communities Found</h2>

            {/* Add Community Button */}
            {
              session &&
              <AddCommunityButton />
            }
          </div>
          
          {/* Bottom Header */}
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
        <Suspense key={query + sortBy + pageSize} fallback={<CommunitiesListSkeleton />}>
          <CommunitiesList
            query={query}
            sortBy={sortBy}
            pageSize={pageSize}
            category={category}
          />
        </Suspense>
      </section>

      {/* Create Community Modal */}
      {searchParams?.createCommunityModal && <CreateCommunityModal />}
      
      {/* Create Category Modal */}
      {searchParams?.createCategoryModal && <CreateCategoryModal />}
    </main>
  )
}