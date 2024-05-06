'use client';

import { saira } from '@/fonts';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import avatar from '../../assets/avatar.jpg';
import { useState } from 'react';
import { ThreadCard as ThreadDetails } from '@/types/threads';

const ThreadCard = ({
  details,
}: {
  details: ThreadDetails;
}) => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<boolean>(false);
  const createdDate = new Date(details.createdAt);

  return (
    <li>
      <Link
        href={`${pathname}/${details.id}`}
        className='group mb-4 grid grid-cols-[50px,_1fr,_max-content] grid-rows-[1fr,_min-content] bg-interex-bg-thread hover:shadow-thread-card-hover hover:translate-x-1 hover:-translate-y-1'
      >
        {/* Upvote display */}
        <div
          className={`
            relative bg-[#091123E5] flex flex-col items-center py-2 pl-1 text-sm font-semibold col-start-1 col-end-2 row-start-1 row-end-3
            after:absolute after:w-1 after:bg-[#66C0F480] after:top-0 after:left-0 after:bottom-0 group-hover:after:bg-[#C0E6FC]`
          }
        >
          <div
            className='fill-white'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={(e) => e.preventDefault()}
          >
            {hovered ? (
              <svg className='block w-6 h-6 mb-2' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg>
            ) : (
              <svg
                className='block w-6 h-6 mb-2'
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 0 512 512"
              >
                <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z"/>
              </svg>
            )}
          </div>
          {details.numUpvotes}
        </div>

        {/* Main Content */}
        <div className='px-4 py-2 col-start-2 col-end-3 row-start-1 row-end-2'>
          {/* Posted Date */}
          <div className='border-l-2 border-l-white flex items-center mb-1'>
            <svg className='fill-white mx-2' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
            <p className='m text-sm'><span className='font-bold underline'>Posted on:</span> {createdDate.toLocaleString('default', { month: 'short', year: 'numeric', day: 'numeric' })}</p>
          </div>

          {/* Thread Title */}
          <h3 className={`${saira.className} font-semibold text-xl mb-1`}>{details.title}</h3>

          {/* Flairs */}
          <ul className='flex flex-wrap gap-2'>
            {details.flairs.map((flair) => {
              return (
                <li
                  key={flair.id}
                  className={`font-medium text-sm text-black rounded-lg px-3`}
                  style={{ backgroundColor: `${flair.hexColor}` }}
                >
                  {flair.name}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Author */}
        <div className='col-start-3 col-end-4 row-start-1 row-end-2 flex items-center mt-2 mr-4 self-start gap-2 text-sm text-interex-aqua'>
          <Image
            className='w-10 rounded-full border-white border-2'
            src={avatar}
            alt='avatar'
          />
          {details.author}
        </div>

        {/* Comment Section */}
        <div className='flex items-center gap-4 py-2 mx-4 border-t-[#2B4072E5] border-t col-start-2 col-end-4 row-start-2 row-end-3'>
          <div className='flex items-center gap-2 text-sm font-semibold'>
            <svg className='fill-white' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
            {details.numComments} Comments
          </div>
          <button type='button' className='flex items-center gap-2 text-sm font-semibold'>
            <svg className='fill-white' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"/></svg>
            Save
          </button>
        </div>
      </Link>
    </li>
  )
}

export default ThreadCard;
