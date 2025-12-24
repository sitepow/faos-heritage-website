import { Role } from '@prisma/client'
import { compare } from 'bcryptjs'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'

import { ERROR_CODES } from '@/lib/errors/codes'
import { prisma } from '@/lib/prisma'

export const NEXT_AUTH_OPTIONS: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase()
        const password = credentials?.password

        if (!email || !password) {
          throw new Error(ERROR_CODES.INVALID_CREDENTIALS)
        }

        if (password.length < 6) {
          throw new Error(ERROR_CODES.PASSWORD_TOO_SHORT)
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) {
          throw new Error(ERROR_CODES.SOCIAL_ACCOUNT_EXISTS)
        }

        if (!user.isActive) {
          throw new Error(ERROR_CODES.ACCOUNT_SUSPENDED)
        }

        const valid = await compare(password, user.password)

        if (!valid) {
          throw new Error(ERROR_CODES.INVALID_CREDENTIALS)
        }

        return user
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true

      const email = user.email?.toLowerCase()

      if (!email) return false

      const existing = await prisma.user.findUnique({
        where: { email },
      })

      if (!existing) {
        await prisma.user.create({
          data: {
            email,
            name: user.name ?? '',
            role: Role.CUSTOMER,
            password: null,
          },
        })
      }

      return true
    },

    async jwt({ token }) {
      if (token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase() },
          select: {
            id: true,
            role: true,
            name: true,
            image: true,
          },
        })

        if (user) {
          token.id = user.id
          token.role = user.role
          token.name = user.name
          token.picture = user.image
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(NEXT_AUTH_OPTIONS)

export { handler as GET, handler as POST }
