import { useCallback, useState } from 'react'

import { uploadFiles, deleteFile } from '@/app/actions/file'

interface UseResolveImageUploadParams {
  oldImage?: string | null
  previewFiles: readonly File[]
}

interface UseResolveImageUploadResult {
  isUploading: boolean
  resolveImagePath: () => Promise<string | null | undefined>
}

const useResolveImageUpload = ({
  oldImage,
  previewFiles,
}: UseResolveImageUploadParams): UseResolveImageUploadResult => {
  const [isUploading, setIsUploading] = useState(false)

  const resolveImagePath = useCallback(async () => {
    if (previewFiles.length === 0) {
      return oldImage
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      for (const file of previewFiles) {
        formData.append('files', file)
      }

      const result = await uploadFiles(formData)

      if (!('data' in result)) {
        return oldImage
      }

      const newImage = result.data.urls?.[0]
      if (!newImage) {
        return oldImage
      }

      if (oldImage && oldImage !== newImage) {
        await deleteFile(oldImage)
      }

      return newImage
    } finally {
      setIsUploading(false)
    }
  }, [oldImage, previewFiles])

  return {
    isUploading,
    resolveImagePath,
  }
}

export { useResolveImageUpload }
