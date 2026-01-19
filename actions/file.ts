'use server'

import { promises as fs } from 'fs'
import path from 'path'

import type { ActionResult } from '@/lib/errors/types'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { optimizeImageServer } from '@/utils/helpers/optimize/image/server'

export const uploadFiles = async (
  formData: FormData,
): Promise<ActionResult<{ urls: string[] }>> => {
  const files = formData.getAll('files') as File[]

  if (!files || files.length === 0) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await fs.mkdir(uploadDir, {
    recursive: true,
  })

  let filePaths = []

  for (const file of files) {
    const filename = `${crypto.randomUUID()}.webp`
    const relativePath = `/uploads/${filename}`
    const filePath = path.join(uploadDir, filename)

    const buffer = await optimizeImageServer(await file.arrayBuffer())

    await fs.writeFile(filePath, new Uint8Array(buffer))
    filePaths.push(relativePath)
  }

  return done({ urls: filePaths })
}

export const deleteFile = async (
  relativePath: string,
): Promise<ActionResult<void>> => {
  if (!relativePath) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const filePath = path.join(process.cwd(), 'public', relativePath)

  try {
    await fs.access(filePath)
    await fs.unlink(filePath)
    return done()
  } catch {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }
}
