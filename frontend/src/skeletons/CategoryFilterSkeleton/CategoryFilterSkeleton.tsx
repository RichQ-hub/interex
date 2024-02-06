import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryFilterSkeleton = () => {
  return (
    <Skeleton count={6} baseColor='#A6BFE326' />
  )
}

export default CategoryFilterSkeleton;
