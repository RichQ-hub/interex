'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const PageSizeButton = ({
  options
}: {
  options: string[]
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <button
      className='relative bg-interex-light-blue px-4 py-2 w-12'
      type='button'
      onClick={() => setIsOpen(!isOpen)}
    >
      <p className='text-left'>{searchParams.get('pageSize') ?? 10}</p>

      {/* Dropdown Menu */}
      {isOpen &&
        <ul className='absolute top-[100%] right-0 left-0 z-10 bg-[#242526]'>
          {options.map((opt, idx) => {
            return (
              <li key={idx}>
                <button
                  className='flex justify-start w-full px-4 py-2 hover:bg-[#525357]'
                  type='button'
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', '1');
                    params.set('pageSize', opt);
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                  }}
                >
                  {opt}
                </button>
              </li>
            )
          })}
        </ul>
      }
    </button>
  )
}

export default PageSizeButton;

/**
 * NOTE:
 * In the future, could make this button as well as the Sort Button component as a single component.
 */