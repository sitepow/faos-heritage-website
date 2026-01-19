import { useState } from 'react'

import { uploadFiles, deleteFile } from '@/actions/file'

interface Params {
  oldImage?: string | null
  previewFiles: File[]
}

const useImageUpload = ({ oldImage, previewFiles }: Params) => {
  const [isUploading, setIsUploading] = useState(false)

  const resolveImagePath = async (): Promise<string | null | undefined> => {
    let imagePath = oldImage

    if (previewFiles.length === 0) {
      return imagePath
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      previewFiles.forEach((file) => formData.append('files', file))

      const result = await uploadFiles(formData)

      if (!('data' in result)) {
        return imagePath
      }

      const newImage = result.data.urls[0]
      imagePath = newImage

      if (oldImage && oldImage !== newImage) {
        await deleteFile(oldImage)
      }

      return imagePath
    } finally {
      setIsUploading(false)
    }
  }

  return {
    resolveImagePath,
    isUploading,
  }
}

export { useImageUpload }
