import AuthService from '@/services/AuthService';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Interex Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@hotmail.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        const user = await AuthService.login(credentials?.email || '', credentials?.password || '');
        if (!(user.error || null)) {
          return {
            id: user.id, // This will be set as the value for the 'sub' property in the JWT token (the token object in JWT callback will have sub).
            email: user.email,
            accessToken: user.accessToken,
            name: user.name,
          };
        }

        // Return null if we weren't able to log in.
        return null;
      }
    })
  ],
  callbacks: {
    /**
     * In this callback, we are able to add properties to the token payload. The user
     * parameter is the user object that we return from the authorize method from the
     * credentials provider we set above.
     * 
     * NOTE:
     * The argument user is only passed the first time this callback is called on a new
     * session, after the user signs in. In subsequent calls, only token will be available.
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = user.accessToken;
        token.name = user.name;
      }
      return token;
    },

    /**
     * This callback receives the token returned from the jwt callback above. We can then
     * set additional properties in the session object that we can use when we call
     * getServerSession() in our server components.
     * 
     * REMEMBER:
     * The jwt() callback is invoked first before this session() callback, since this
     * receives the token returned from jwt() callback.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.name = token.name;
      }
      return session;
    }
  },
  // This pages property allows us to create custom sign in pages that we define.
  pages: {
    signIn: '/login',
  }
}

/**
 * REFERENCES:
 * https://next-auth.js.org/configuration/callbacks#session-callback
 * https://next-auth.js.org/configuration/options#callbacks
 */
