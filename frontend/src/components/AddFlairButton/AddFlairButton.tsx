'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const AddFlairButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const openModal = () => {
    const params = new URLSearchParams(searchParams);
    params.set('createFlairModal', 'true');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <button
      className='flex items-center justify-center w-8 h-8 ml-auto hover:bg-interex-input rounded-full'
      type='button'
      onClick={openModal}
    >
      <svg className='fill-white w-1/3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
    </button>
  )
}

export default AddFlairButton;
