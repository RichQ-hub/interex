'use client';

import { saira } from '@/fonts';
import { signOut } from 'next-auth/react';
import React from 'react';

const LogoutButton = () => {
  return (
    <button
      className={`${saira.className} px-6 h-2/3 bg-[#1E2329] font-bold text-xl flex items-center shadow-[0px_4px_4px_2px_rgba(0,0,0,0.80)]`}
      type='button'
      onClick={() => signOut()}
    >
      LOGOUT
    </button>
  )
}

export default LogoutButton;
