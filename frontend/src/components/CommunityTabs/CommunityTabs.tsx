'use client'

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const LINKS = ['Threads', 'Description', 'Members'];

const CommunityTabs = ({
  communityId
}: {
  communityId: string;
}) => {
  const pathname = usePathname();

  return (
    <ul className='flex items-center font-semibold border-b-2 border-b-[#66C0F440] box-content mb-6'>
      {LINKS.map((link, idx) => {
        const path = `/communities/${communityId}/${link.toLowerCase()}`;
        return (
          <li key={idx}>
            <Link className={clsx(
              `block relative text-center px-3 pb-2 text-zinc-400 text-lg after:absolute after:bottom-0 after:left-0
              after:right-0 after:bg-interex-blue after:h-[2px] after:scale-x-0 after:transition-transform
              after:duration-300 hover:text-zinc-100`,
              {
                'after:scale-x-100 !text-zinc-100': pathname === path
              }
            )} href={path}>
              {link}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default CommunityTabs;
