import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

import StravaProvider from "next-auth/providers/strava"


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

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        if (user.role === "USER") return null
        if (!user.passwordHash) return null

        const bcrypt = require("bcryptjs")
        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return user
      },
    }),

    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read,activity:read_all",
        },
      },
      token: {
        // This runs when Strava redirects back with ?code=...
        // We call Strava's token endpoint and then return ONLY the fields
        // our Prisma Account model knows about.
        async request({ client, params, checks, provider }) {
          const response = await client.oauthCallback(
            provider.callbackUrl,
            params,
            checks,
          )

          const {
            access_token,
            refresh_token,
            expires_at,
            token_type,
            // 🔴 Strava also returns `athlete` here, but we IGNORE it.
            // athlete, // <- we intentionally do NOT include this
          } = response

          // NextAuth will pass this `tokens` object into the PrismaAdapter,
          // and Prisma will store only these fields on Account.
          return {
            tokens: {
              access_token,
              refresh_token,
              expires_at,
              token_type,
            },
          }
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        ;(session.user as any).id = token.sub
      }
      if (token.role && session.user) {
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
}
