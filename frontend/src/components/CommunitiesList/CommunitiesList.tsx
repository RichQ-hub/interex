import React from 'react';
import CommunityCard from '../CommunityCard';
import CommunityService from '@/services/CommunityService';

const CommunitiesList = async ({
  query,
  sortBy,
  pageSize,
  category,
}: {
  query: string;
  sortBy: string;
  pageSize: string;
  category: string | string[];
}) => {
  const communities = await CommunityService.searchCommunities(query, sortBy, pageSize, category);

  // Simulate 2s loading time.
  // await new Promise((resolve) => setTimeout(resolve, 3000)); 

  return (
    <ul className='mb-6 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] auto-rows-max justify-items-center gap-7'>
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
  )
}

export default CommunitiesList;
