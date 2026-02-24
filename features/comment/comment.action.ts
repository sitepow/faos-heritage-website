'use server'

import { Role, ReviewStatus } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { commentSchema, type CommentInput } from './comment.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'

const getCommentsByPost = async (postId: string) => {
  noStore()
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
      status: ReviewStatus.APPROVED,
    },
    include: {
      user: { select: { name: true, image: true } },
      replies: {
        where: { status: ReviewStatus.APPROVED },
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return comments
}

const createComment = async (data: CommentInput) => {
  const { userId } = await getServerUser()
  if (!userId) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  const validated = commentSchema.safeParse(data)
  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    let finalParentId = validated.data.parentId

    if (finalParentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: finalParentId },
        select: { parentId: true },
      })

      if (parentComment?.parentId) {
        finalParentId = parentComment.parentId
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: validated.data.content,
        postId: validated.data.postId,
        parentId: finalParentId,
        userId,
        status: ReviewStatus.APPROVED,
      },
    })

    return ok(comment)
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const deleteComment = async (commentId: string) =>
  withRole([Role.ADMIN], async () => {
    try {
      await prisma.comment.delete({ where: { id: commentId } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

export { getCommentsByPost, createComment, deleteComment }
