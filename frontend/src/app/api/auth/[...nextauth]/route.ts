import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

const handler = NextAuth(authOptions);

// We export the handler as both GET and POST. So any request to the route "api/auth/[...nextauth]" (ending in whatever),
// gets handled by the handler defined in authOptions. So the authorize() method gets called inside the CredentialsProvider
// when we make a 'POST' or 'GET' request to "api/auth/" (ending in whatever is defined in authOptions).
export { handler as GET, handler as POST };
