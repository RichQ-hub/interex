import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommunityCardSkeleton = () => {
  return (
    <li className='bg-interex-comm-card max-w-[200px] w-full list-none'>
      <div className='mt-52 py-2 px-3 bg-interex'>
        <Skeleton
          className='mb-2'
          baseColor='#A6BFE326'
          height={20}
        />

        <div className='flex gap-2 items-center mb-2'>
          <svg className='w-6' fill="#ffffff" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M1242.353 451.753v1016.471H757.496l-418.672 418.673v-418.673H0V451.754h1242.353ZM1920.033.033v1016.471h-225.881v419.012l-338.937-338.936V338.857H677.681V.034h1242.353ZM677.76 1016.46H338.824v112.94H677.76v-112.94Zm225.77-225.882H338.823V903.63h564.705V790.577Z" fillRule="evenodd"/>
          </svg>
          <Skeleton containerClassName='flex-1' baseColor='#A6BFE326' height={14}/>
        </div>

        <ul className='flex flex-wrap gap-2'>
          {[...Array(3)].map((_, idx) => {
            return (
              <li key={idx} className='w-10'>
                <Skeleton
                  baseColor='#A6BFE326'
                  containerClassName='flex-1'
                  height={14}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

export default CommunityCardSkeleton