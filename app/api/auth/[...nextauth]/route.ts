import { Role } from '@prisma/client'
import { compare } from 'bcryptjs'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'

import { prisma } from '@/utils/prisma'

const NEXT_AUTH_OPTIONS: NextAuthOptions = {
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
          throw new Error('Please enter your email and password.')
        }

        if (password.length < 6) {
          throw new Error('The password must be at least 6 characters long.')
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) {
          throw new Error(
            'This account was not found, or this account was registered with Google / Facebook. Please log in using the same method you used before.',
          )
        }

        if (!user?.isActive) {
          throw new Error(
            'This account has been suspended. Please contact your administrator to request access again.',
          )
        }

        const valid = await compare(password, user.password)

        if (!valid) {
          throw new Error('The password is incorrect. Please try again.')
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

export { NEXT_AUTH_OPTIONS }
export { handler as GET, handler as POST }
