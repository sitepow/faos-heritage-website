'use server'

import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'

import type { ActionResult } from '@/lib/errors/types'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { getPathFromPublicUrl } from '@/utils/app/helpers/supabase'
// import { optimizeImageServer } from '@/utils/optimize/image/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export const uploadFilesSupabase = async (
  formData: FormData,
): Promise<ActionResult<{ urls: string[] }>> => {
  const files = formData.getAll('files') as File[]

  if (!files?.length) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const urls: string[] = []

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    // const buffer = await optimizeImageServer(await file.arrayBuffer())

    const fileName = `${crypto.randomUUID()}.webp`

    const { error } = await supabase.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: 'image/webp',
      })

    if (error) {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName)

    if (!data?.publicUrl) {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }

    urls.push(data.publicUrl)
  }

  return done({ urls })
}

export const deleteFileSupabase = async (
  publicUrl?: string | null,
): Promise<ActionResult<void>> => {
  if (!publicUrl) {
    return done()
  }

  const filePath = getPathFromPublicUrl(publicUrl)

  if (!filePath) {
    return done()
  }

  const { error } = await supabase.storage.from('uploads').remove([filePath])

  if (error) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

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

    const buffer = await file.arrayBuffer()
    // const buffer = await optimizeImageServer(await file.arrayBuffer())

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
