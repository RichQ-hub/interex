import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { saira } from '@/fonts';
import { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

export const metadata: Metadata = {
  title: 'Communities',
  description: 'Search for communities or create your own!',
}

export default async function CommunityFinderPage() {
  const session = await getServerSession(authOptions);
  // console.log('COMMUNITIES:');
  // console.log(session)

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
      <section className='max-w-7xl mx-auto grid grid-cols-comm-content grid-rows-comm-content'>

        {/* Sidebar */}
        <aside className='relative pr-6 col-start-1 col-end-2 row-start-2 row-end-3'>
          <div className='sticky p-4 bg-interex-category-aside top-20 shadow-comm-filter'>
            <h2 className={`${saira.className} pb-2 text-2xl font-semibold`}>Categories</h2>
            <CategoryFilter />
          </div>
        </aside>

        {/* Community Data */}
        <div className='col-start-2 col-end-3 whitespace-pre-line'>nah</div>

        {/* Community Cards */}
        <div className='h-[3000px]'>huh</div>
      </section>
    </main>
  )
}