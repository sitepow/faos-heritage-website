'use server'

import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'

import { optimizeImage } from '@/utils/image'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const uploadFilesSupabase = async (formData: FormData) => {
  const files = formData.getAll('files') as File[]

  if (!files?.length) {
    throw new Error('No files provided')
  }

  const urls: string[] = []

  for (const file of files) {
    const buffer = await optimizeImage(await file.arrayBuffer())

    const fileName = `${crypto.randomUUID()}.webp`

    const { error } = await supabase.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: 'image/webp',
      })

    if (error) throw error

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName)

    urls.push(data.publicUrl)
  }

  return urls
}

const getPathFromPublicUrl = (url: string) => {
  const marker = '/object/public/uploads/'

  return url.split(marker)[1]
}

const deleteFileSupabase = async (publicUrl?: string | null) => {
  if (!publicUrl) return

  const filePath = getPathFromPublicUrl(publicUrl)

  if (!filePath) return

  const { error } = await supabase.storage.from('uploads').remove([filePath])

  if (error) throw error
}

const uploadFiles = async (formData: FormData) => {
  const files = formData.getAll('files') as File[]

  if (!files || files.length === 0) {
    throw new Error('The file to be uploaded has not been specified.')
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

    const buffer = await optimizeImage(await file.arrayBuffer())

    await fs.writeFile(filePath, new Uint8Array(buffer))
    filePaths.push(relativePath)
  }

  return filePaths
}

const deleteFile = async (relativePath: string) => {
  if (!relativePath) {
    throw new Error(
      'The relative path of the file to be deleted was not specified.',
    )
  }

  const fullPathToDelete = path.join(process.cwd(), 'public', relativePath)

  try {
    await fs.access(fullPathToDelete)

    await fs.unlink(fullPathToDelete)
  } catch {
    return
  }
}

export { deleteFile, uploadFiles, uploadFilesSupabase, deleteFileSupabase }
