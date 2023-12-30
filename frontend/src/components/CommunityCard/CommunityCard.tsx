import Link from 'next/link';
import React from 'react'

const CommunityCard = ({
  communityId,
  name,
  numThreads,
  categories,
}: {
  communityId: string;
  name: string;
  numThreads: string;
  categories: string[];

}) => {
  return (
    <Link href={`${communityId}?page=1`}>
      <h3>{name}</h3>
    </Link>
  )
}

export default CommunityCard;
