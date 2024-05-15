import React from 'react';
import CommunityService from '@/services/CommunityService';
import { saira } from '@/fonts';
import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import AddFlairButton from '../AddFlairButton';

const CommunityAside = async ({
  communityId,
}: {
  communityId: string;
}) => {
  // Recall fetch calls are memoized (so the fetch call in CommunityTitle.tsx is not called again).
  const communityDetails = await CommunityService.getCommunityDetails(communityId);
  const createDate = dayjs(communityDetails.createdAt);
  const session = await getServerSession(authOptions);

  return (
    <>
      <h2 className={`${saira.className} mb-4 font-semibold text-2xl`}>About</h2>
      <p className='mb-4'>{communityDetails.description}</p>

      {/* Creation Date. */}
      <div className='mb-4 flex items-center font-medium gap-2'>
        <svg className='w-12 h-8 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm80 64c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80z"/></svg>
        Created {createDate.format('MMM D, YYYY')}
      </div>

      {/* Num Members */}
      <div className='mb-5 flex items-center font-medium gap-2'>
        <svg className='w-12 h-8 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M0 24C0 10.7 10.7 0 24 0H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 48 0 37.3 0 24zM0 488c0-13.3 10.7-24 24-24H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zM83.2 160a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM32 320c0-35.3 28.7-64 64-64h96c12.2 0 23.7 3.4 33.4 9.4c-37.2 15.1-65.6 47.2-75.8 86.6H64c-17.7 0-32-14.3-32-32zm461.6 32c-10.3-40.1-39.6-72.6-77.7-87.4c9.4-5.5 20.4-8.6 32.1-8.6h96c35.3 0 64 28.7 64 64c0 17.7-14.3 32-32 32H493.6zM391.2 290.4c32.1 7.4 58.1 30.9 68.9 61.6c3.5 10 5.5 20.8 5.5 32c0 17.7-14.3 32-32 32h-224c-17.7 0-32-14.3-32-32c0-11.2 1.9-22 5.5-32c10.5-29.7 35.3-52.8 66.1-60.9c7.8-2.1 16-3.1 24.5-3.1h96c7.4 0 14.7 .8 21.6 2.4zm44-130.4a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM321.6 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>
        {communityDetails.members.length}&nbsp;
        {communityDetails.members.length === 1 ? (
          <>Member</>
        ) : (
          <>Members</>
        )}
      </div>

      {/* Flairs */}
      <div className='pt-4 mb-4 flex items-center border-t-2 border-t-[#ffffff33]'>
        <h2 className={`${saira.className} font-semibold text-2xl`}>Flairs</h2>
        {session &&
          <AddFlairButton />
        }
      </div>
      <ul className='flex flex-wrap gap-2'>
        {communityDetails.flairs.map((flair) => {
          return (
            <li
              key={flair.id}
              className='font-medium text-sm text-black rounded-xl px-3 py-1'
              style={{ backgroundColor: `${flair.hexColor}` }}
            >
              {flair.name}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default CommunityAside;
