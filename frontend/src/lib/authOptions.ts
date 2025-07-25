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
			// This is a handler function that accepts credentials submitted via a HTTP POST request as input. 
			// Essentially, this is the function that gets called when the sign-in button is clicked.
      async authorize(credentials) {
        const user = await AuthService.login(credentials?.email || '', credentials?.password || '');
        console.log(user);

				// If login with backend is successful, we return a user object.
        if (!(user.error || null)) {
          return {
            id: user.id, // This will be set as the value for the 'sub' property in the JWT token (the token object in JWT callback will have sub).
            email: user.email,
            accessToken: user.accessToken,
            username: user.username,
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
     * parameter is the user object that we return from the authorize() method from the
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
        token.username = user.username;
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
        session.user.username = token.username;
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
