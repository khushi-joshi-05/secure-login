import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { authOptions } from "@/lib/auth";
import type { NextAuthOptions } from "next-auth";
import { NextApiRequest } from 'next';


interface FailedAttempt {
  count: number;
  timestamp: number;
}


const failedAttemptsCache: { [key: string]: FailedAttempt } = {};




const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
      const request = req as unknown as {
      req: {
      headers: { [key: string]: string | string[] | undefined };
      socket: { remoteAddress: string };
      };
      };


      // Add a fallback IP for local development where IP detection can fail.
     // This will allow the rate-limiting logic to still work.
      const ip = (request.req?.headers['x-forwarded-for'] as string) || request.req?.socket?.remoteAddress || '127.0.0.1';


 
      // The check for "if (typeof ip !== 'string')" is no longer needed
     // because the fallback IP ensures 'ip' is always a string.
 
      if (failedAttemptsCache[ip] && failedAttemptsCache[ip].count >= 5) {
       const timeElapsed = Date.now() - failedAttemptsCache[ip].timestamp;
       if (timeElapsed < 5 * 60 * 1000) { // 5 minutes
        console.warn(`🚨 Spoof Detection: Potential brute-force attack from IP ${ip}. Too many failed login attempts.`);
        return null;
       } else {
        failedAttemptsCache[ip] = { count: 0, timestamp: Date.now() };
       }
      }




        if (
          credentials?.email === "test@test.com" &&
          credentials?.password === "1234"
        ) {
         
          if (failedAttemptsCache[ip]) {
            failedAttemptsCache[ip].count = 0;
          }
          return { id: "1", name: "Test User", email: "test@test.com" }
        }


       
        if (!failedAttemptsCache[ip]) {
          failedAttemptsCache[ip] = { count: 0, timestamp: Date.now() };
        }
        failedAttemptsCache[ip].count++;
        failedAttemptsCache[ip].timestamp = Date.now();
        console.log(`❌ Failed login attempt for user: ${credentials?.email} from IP: ${ip}. Attempt count: ${failedAttemptsCache[ip].count}`);


        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,


  callbacks: {
    async signIn({ user }) {
      console.log(
        `[LOGIN] User: ${user?.email}, ID: ${user?.id}, Time: ${new Date().toLocaleString()}`
      )
      return true
    },
    async jwt({ token, user }) {
      if (user) token.userId = (user as any).id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as any).id = token.userId as string
      }
      return session
    },
  },


 
  events: {
    signOut(message) {
      console.log(
        `[LOGOUT] User: ${message.token?.email}, Time: ${new Date().toLocaleString()}`
      );
    },
  },




})


export { handler as GET, handler as POST }



