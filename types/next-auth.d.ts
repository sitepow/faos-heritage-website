import type { Role } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    roles: Role[]
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      roles: Role[]
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    roles: Role[]
  }
}
