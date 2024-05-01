import React from 'react';
import CommunityService from '@/services/CommunityService';

const CommunityTitle = async ({
  communityId,
}: {
  communityId: string;
}) => {
  const communityDetails = await CommunityService.getCommunityDetails(communityId);

  return (
    <h1 className='text-interex-blue text-4xl font-bold ml-4'>{communityDetails.name}</h1>
  )
}

export default CommunityTitle