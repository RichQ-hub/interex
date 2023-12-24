import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth'

export default async function CommunityFinderPage() {
  const session = await getServerSession(authOptions);
  console.log('COMMUNITIES:');
  console.log(session)

  return (
    <main className='mt-14'>Community Finder Page</main>
  )
}