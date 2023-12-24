import React from 'react';
import logoImg from '../../assets/logo2.svg';
import Image from 'next/image';
import { nova } from '@/fonts';
import Navlinks from './Navlinks';

const Navbar = () => {
  return (
    <nav
      className='px-3 fixed top-0 left-0 right-0 h-14 bg-interex-nav flex items-center'
    >
      {/* Logo Section */}
      <div className={`${nova.className} flex items-center h-full text-xl text-interex-brand`}>
        <Image src={logoImg} alt='Interex Logo' className='h-5/6'/>
        interex
      </div>

      {/* Navlinks Section */}
      <Navlinks />

      {/* Auth Section. */}
    </nav>
  )
}

export default Navbar