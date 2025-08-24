import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { authOptions } from "@/lib/auth";
import type { NextAuthOptions } from "next-auth";

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
      async authorize(credentials) {
        if (
          credentials?.email === "test@test.com" &&
          credentials?.password === "1234"
        ) {
          return { id: "1", name: "Test User", email: "test@test.com" }
        }
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
