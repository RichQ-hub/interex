'use client'

import { saira } from '@/fonts'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  {
    name: 'COMMUNITY',
    href: '/communities',
  },
  {
    name: 'TEAMS',
    href: '/teams',
  },
  {
    name: 'CONTACT',
    href: '/contact',
  }
]

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className={`${saira.className} text-zinc-50 font-semibold text-lg flex h-full ml-3`}>
      {NAV_LINKS.map((link, idx) => {
        return (
          <li
            key={idx}
            className='h-full'>
            <Link
              className='relative h-full flex items-center px-4 after:absolute after:bottom-0 after:left-0
              after:right-0 after:bg-interex-blue after:w-full after:h-1 after:scale-x-0 after:transition-transform
              after:duration-200 after:ease-in-out hover:after:scale-x-100'
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}