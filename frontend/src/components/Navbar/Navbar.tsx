import React from 'react';
import logoImg from '../../assets/logo2.svg';
import Image from 'next/image';
import { nova, saira } from '@/fonts';
import Navlinks from './Navlinks';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav
      className='px-3 fixed top-0 left-0 right-0 h-14 bg-interex-nav flex items-center z-50'
    >
      {/* Logo Section */}
      <Link href='/' className={`${nova.className} flex items-center h-full text-xl text-interex-brand`}>
        <Image src={logoImg} alt='Interex Logo' className='h-5/6'/>
        interex
      </Link>

      {/* Navlinks Section */}
      <Navlinks />

      {/* Auth Section. */}
      {session ? (
        <>
          <p className='ml-auto text-interex-aqua mr-3'>@{session.user.username}</p>
          <LogoutButton />
        </>
      ) : (
				<LoginButton />
      )}
    </nav>
  )
}

export default Navbar