import React from 'react';
import logoImg from '../../assets/logo2.svg';
import Image from 'next/image';
import { nova, saira } from '@/fonts';
import Navlinks from './Navlinks';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav
      className='px-3 fixed top-0 left-0 right-0 h-14 bg-interex-nav flex items-center z-50'
    >
      {/* Logo Section */}
      <div className={`${nova.className} flex items-center h-full text-xl text-interex-brand`}>
        <Image src={logoImg} alt='Interex Logo' className='h-5/6'/>
        interex
      </div>

      {/* Navlinks Section */}
      <Navlinks />

      {/* Auth Section. */}
      <Link
        href='/login'
        className={`${saira.className} ml-auto px-6 h-2/3 bg-[#1E2329] font-bold text-xl flex items-center shadow-[0px_4px_4px_2px_rgba(0,0,0,0.80)]`}
      >LOG IN</Link>
    </nav>
  )
}

export default Navbar