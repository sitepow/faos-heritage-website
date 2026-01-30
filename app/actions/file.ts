'use server'

import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

import { UPLOAD_DIR, UPLOAD_URL_PREFIX, PUBLIC_DIR } from '@/constants'
import { fail, ok, type ActionResult } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { ImageOptimizeServer } from '@/utils/image.server'

const ensureUploadDirExists = async () => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
}

const generateFileName = () => `${crypto.randomUUID()}.webp`

const saveOptimizedImage = async (file: File): Promise<string> => {
  const filename = generateFileName()
  const absolutePath = path.join(UPLOAD_DIR, filename)
  const relativePath = `${UPLOAD_URL_PREFIX}/${filename}`

  const optimizedBuffer = await ImageOptimizeServer(await file.arrayBuffer())

  await fs.writeFile(absolutePath, new Uint8Array(optimizedBuffer))

  return relativePath
}

const uploadFiles = async (
  formData: FormData,
): Promise<ActionResult<{ urls: string[] }>> => {
  const files = formData.getAll('files') as File[]

  if (!files.length) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  await ensureUploadDirExists()

  const urls = await Promise.all(files.map(saveOptimizedImage))

  return ok({ urls })
}

const deleteFile = async (
  relativePath: string,
): Promise<ActionResult<void>> => {
  if (!relativePath) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const absolutePath = path.join(PUBLIC_DIR, relativePath)

  try {
    await fs.unlink(absolutePath)
    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export { uploadFiles, deleteFile }
