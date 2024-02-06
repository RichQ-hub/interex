import React from 'react';
import CommunityCardSkeleton from '../CommunityCardSkeleton';

const CommunitiesListSkeleton = () => {
  return (
    <ul className='mb-6 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] auto-rows-max justify-items-center gap-7'>
      {[...Array(8)].map((_, idx) => {
        return (
          <CommunityCardSkeleton
            key={idx}
          />
        )
      })}
    </ul>
  )
}

export default CommunitiesListSkeleton;
