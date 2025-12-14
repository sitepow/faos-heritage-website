import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const getPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target as string[] | undefined
        const field = target?.[0] ?? 'This information'

        throw new Error(
          `${field} It's already in the system. Please try again.`,
        )
      }

      case 'P2025':
        throw new Error(
          'The requested information was not found. Please try again.',
        )

      case 'P2003':
        throw new Error(
          'The reference information is incorrect. Please try again.',
        )

      default:
        throw new Error(error.message)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('The information is incorrect. Please try again.')
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new Error('Unable to connect to the database.')
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new Error(`An error occurred: ${error.message}`)
  }

  if (error instanceof Error) {
    throw new Error(error.message)
  }

  throw new Error('An error of unknown cause occurred.')
}
