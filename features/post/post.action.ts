'use server'

import {
  Role,
  type Prisma,
  type PostStatus,
  ReviewStatus,
} from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { postSchema, type PostInput } from './post.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'
import { applyLocalization } from '@/utils/localization'

const createPost = async (data: PostInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = postSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { userId } = await getServerUser()
    if (!userId) {
      return fail(ERROR_CODES.UNAUTHORIZED)
    }

    try {
      const { tagIds, ...rest } = validated.data
      const payload = omitEmptyFields({
        ...rest,
        authorId: userId,
        tags: tagIds ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      }) as Prisma.PostCreateInput

      await prisma.post.create({ data: payload })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updatePost = async (data: PostInput) =>
  withRole(['ADMIN'], async () => {
    const validated = postSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, tagIds, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.post.update({
        where: { id },
        data: {
          ...payload,
          tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
        } as Prisma.PostUpdateInput,
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deletePost = async (postIds: string | string[]) =>
  withRole(['ADMIN'], async () => {
    const ids = Array.isArray(postIds) ? postIds : [postIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      const posts = await prisma.post.findMany({
        where: { id: { in: ids } },
        select: { featuredImage: true },
      })

      const images = posts
        .map((p) => p.featuredImage)
        .filter(Boolean) as string[]
      await Promise.all(images.map((url) => deleteFile(url)))

      await prisma.post.deleteMany({ where: { id: { in: ids } } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getPost = async (id: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          localizations: { where: { languageCode }, take: 1 },
        },
      },
      tags: {
        include: {
          localizations: { where: { languageCode }, take: 1 },
        },
      },
      author: { select: { name: true, image: true } },
      localizations: { where: { languageCode }, take: 1 },
      _count: {
        select: { comments: { where: { status: ReviewStatus.APPROVED } } },
      },
    },
  })

  return applyLocalization(post)
}

const getPostsInfinite = async ({
  cursor,
  limit = 10,
  categoryId,
  status,
  locale,
}: {
  cursor?: string | null
  limit?: number
  categoryId?: string | null
  status?: PostStatus
  locale?: string
}) => {
  noStore()
  const languageCode = locale?.toUpperCase()

  const where: Prisma.PostWhereInput = {
    ...(status && { status }),
    ...(categoryId && { categoryId }),
  }

  const items = await prisma.post.findMany({
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          localizations: {
            where: { languageCode },
            take: 1,
            select: { name: true },
          },
        },
      },
      tags: {
        include: {
          localizations: {
            where: { languageCode },
            take: 1,
            select: { name: true },
          },
        },
      },
      author: { select: { name: true, image: true } },
      localizations: {
        where: { languageCode },
        take: 1,
        select: { title: true, summary: true },
      },
      _count: {
        select: { comments: { where: { status: ReviewStatus.APPROVED } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const hasNextPage = items.length > limit
  const pagedItems = hasNextPage ? items.slice(0, limit) : items

  const resultItems = pagedItems.map((item) => applyLocalization(item))

  const nextCursor = hasNextPage
    ? resultItems[resultItems.length - 1]?.id
    : null

  return { items: resultItems, nextCursor }
}

const getPostStats = async () =>
  withRole(['ADMIN'], async () => {
    const [total, published, drafts] = await prisma.$transaction([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
    ])

    return [
      { name: 'บทความทั้งหมด', value: total },
      { name: 'เผยแพร่แล้ว', value: published },
      { name: 'ฉบับร่าง', value: drafts },
    ]
  })

const increaseViewCount = async (id: string) => {
  if (!id) return fail(ERROR_CODES.BAD_REQUEST)

  try {
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })
    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

type GetPostResult = Awaited<ReturnType<typeof getPost>>
type GetPostsInfiniteResult = Awaited<ReturnType<typeof getPostsInfinite>>

export {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPostsInfinite,
  getPostStats,
  increaseViewCount,
}

export type { GetPostResult, GetPostsInfiniteResult }
