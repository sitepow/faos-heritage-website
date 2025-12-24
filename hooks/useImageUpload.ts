import { useState } from 'react'

import { deleteFileSupabase, uploadFilesSupabase } from '@/actions/file'

interface useImageUploadParams {
  oldImage?: string | null
  previewFiles: File[]
}

export const useImageUpload = ({
  oldImage,
  previewFiles,
}: useImageUploadParams) => {
  const [isUploading, setIsUploading] = useState(false)

  const resolveImagePath = async (): Promise<string | null | undefined> => {
    let imagePath = oldImage

    if (previewFiles.length === 0) {
      return imagePath
    }

    try {
      const formData = new FormData()

      previewFiles.forEach((file) => formData.append('files', file))

      const uploaded = await uploadFilesSupabase(formData)

      imagePath = uploaded[0]

      if (oldImage && imagePath !== oldImage) {
        await deleteFileSupabase(oldImage)
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
