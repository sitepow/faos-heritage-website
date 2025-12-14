'use server'

import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

const uploadFiles = async (formData: FormData) => {
  const files = formData.getAll('files') as File[]

  if (!files || files.length === 0) {
    throw new Error('ไม่ได้ระบุไฟล์ที่ต้องการอัพโหลด')
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

    const arrayBuffer = await file.arrayBuffer()

    const uint8Array = new Uint8Array(
      await sharp(arrayBuffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
        })
        .toBuffer(),
    )

    filePaths.push(relativePath)
    await fs.writeFile(filePath, uint8Array)
  }

  return filePaths
}

const deleteFile = async (relativePath: string) => {
  if (!relativePath) {
    throw new Error('ไม่ได้ระบุ relativePath ของไฟล์ที่ต้องการลบ')
  }

  const fullPathToDelete = path.join(process.cwd(), 'public', relativePath)

  try {
    await fs.access(fullPathToDelete)

    await fs.unlink(fullPathToDelete)
  } catch {
    return
  }
}

export { deleteFile, uploadFiles }
