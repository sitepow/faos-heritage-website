import { prisma } from '@/utils/prisma'
import { Role } from '@prisma/client'
import { compare } from 'bcryptjs'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
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
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน')
        }

        if (password.length < 6) {
          throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) {
          throw new Error(
            'ไม่พบบัญชีผู้ใช้นี้ หรือ บัญชีนี้สมัครด้วย Google / Facebook กรุณาเข้าสู่ระบบด้วยวิธีเดิม',
          )
        }

        if (!user?.isActive) {
          throw new Error(
            'บัญชีนี้ถูกระงับการใช้งาน โปรดติดต่อผู้แลระบบเพื่อขอเข้าการใช้งานอีกครั้ง',
          )
        }

        const valid = await compare(password, user.password)

        if (!valid) {
          throw new Error('รหัสผ่านไม่ถูกต้อง โปรดลองใหม่อีกครั้ง')
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
