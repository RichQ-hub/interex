import { saira } from '@/fonts';
import Image from 'next/image';
import Link from 'next/link';
import avatar from '../../../../../assets/avatar.jpg';
import CommunityRole from '@/components/CommunityRole';
import CommentsList from '@/components/CommentsList';
import ThreadService from '@/services/ThreadService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import PostComment from '@/components/PostComment';
import { Suspense } from 'react';

export default async function ThreadPage({
  params,
}: {
  params: {
    communityId: string;
    threadId: string;
  }
}) {
  const session = await getServerSession(authOptions);
  const details = await ThreadService.getThreadDetails(params.threadId);
  const postedDate = new Date(details.createdAt);

  return (
    <section className='bg-interex-bg-thread p-6'>
      {/* Back button. (Possible change to <btn> since nextjs goes to previous page and remembers scroll pos.) */}
      <Link
        href={`/communities/${params.communityId}/threads`}
        className='bg-[#ffffff33] px-4 py-1 outline-2 hover:outline hover:outline-1 hover:outline-white'
      >
        {`<`} Back
      </Link>

      <h2 className={`${saira.className} font-semibold text-2xl py-4`}>{details.title}</h2>

      {/* Thread Main Discussion */}
      <div className='grid grid-cols-[80px,_1fr] mb-4'>
        {/* Thread Upvotes */}
        <div className='px-4 flex flex-col items-center border-r-[1px] border-r-white'>
          <Image
            className='w-full rounded-full border-white border-2 mb-6'
            src={avatar}
            alt='avatar'
          />
          <svg
            className='block w-6 h-6 mb-2 fill-white'
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            viewBox="0 0 512 512"
          >
            <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z"/>
          </svg>
          <p className='font-medium'>{details.numUpvotes}</p>
        </div>

        {/* Thread Content. */}
        <div className='px-4'>
          {/* Poster Details */}
          <div className='flex items-center'>
            <h3 className={`${saira.className} mb-1 font-semibold text-interex-aqua text-xl mr-3`}>{details.author}</h3>
            {/* Member Role */}
            <CommunityRole role={details.role} />
          </div>

          {/* Posted Date */}
          <div className='flex items-center mb-4'>
            <svg className='fill-white mr-2' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
            <p className='text-sm'><span className='font-bold underline'>Posted on:</span> {postedDate.toLocaleString('default', { month: 'short', year: 'numeric', day: 'numeric' })}</p>
          </div>

          {/* Thread Topic Text */}
          <p className='whitespace-pre-wrap'>{details.content}</p>
        </div>
      </div>

      {/* Post a comment */}
      <h3 className={`${saira.className} text-xl font-semibold mb-4`}>Post a Comment</h3>
      {session ? (
        <PostComment threadId={params.threadId} />
      ) : (
        <div className={`${saira.className} font-semibold border-[1px] border-interex-blue bg-[#091123e6] py-2 px-3 mb-4`}>
          To post a comment, please <Link href='/login' className='underline text-interex-blue'>login</Link>.
        </div>
      )}

      {/* Comments */}
      <h3 className={`${saira.className} text-xl font-semibold mb-4`}>Comments</h3>
      <Suspense fallback={<h1>Loading Comments...</h1>}>
        <CommentsList threadId={params.threadId}/>
      </Suspense>

    </section>
  )
}