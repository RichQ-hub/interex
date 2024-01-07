import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string,
    } & DefaultSession['user'];
  }

  interface User {
    accessToken: string,
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    userId: string;
    accessToken: string;
  }
}

/**
 * REFERENCE:
 * https://next-auth.js.org/getting-started/typescript
 */
