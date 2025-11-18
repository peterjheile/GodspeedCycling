import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

const ADMIN_MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD

if (!ADMIN_MASTER_PASSWORD) {
  throw new Error("ADMIN_MASTER_PASSWORD is not set in env")
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (!email || !password) return null

        // Look up user in Prisma
        const user = await prisma.user.findUnique({
          where: { email },
        })

        // Must exist and be ADMIN
        if (!user || user.role !== "ADMIN") {
          return null
        }

        // For now, all admins share a master password
        if (password !== ADMIN_MASTER_PASSWORD) {
          return null
        }

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On first sign in, copy role from user to token
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
  },
}