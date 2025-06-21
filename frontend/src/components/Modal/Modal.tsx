'use client';

import { saira } from '@/fonts';
import { useRouter } from 'next/navigation';
import React from 'react';

const Modal = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <div
      className='fixed top-0 bg-[#00000053] flex justify-center items-center w-full h-screen z-50 backdrop-blur-sm overscroll-contain'
    >
      <dialog open className='block w-[480px] bg-[#0f1a2c] shadow-comm-filter px-8 py-4 border-[#5a7f9c] border-[1px]'>
        {/* Header */}
        <div className='flex items-center mb-4'>
          <h2 className={`${saira.className} text-interex-blue font-semibold text-xl`}>{title}</h2>

          {/* Close Button */}
          <button
            className='flex items-center justify-center ml-auto w-6 h-6 border-[1px] border-zinc-500 hover:bg-zinc-100'
            type='button'
            onClick={() => router.back()}
          >
            <svg className='fill-white w-1/3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
          </button>
        </div>

        {/* Body */}
        {children}
      </dialog>
    </div>
  )
}

export default Modal;
