'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

/**
 * This exists since the SessionProvider must be a client component in order to use the 
 * useSession() hook form next-auth.
 */

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
