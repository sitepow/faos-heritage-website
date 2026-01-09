import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

import { deleteFileSupabase } from '@/actions/file'
// import { optimizeImageClient } from '@/utils/optimize/image/client'

interface useImageUploadParams {
  oldImage?: string | null
  previewFiles: File[]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

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

    setIsUploading(true)

    try {
      const originalFile = previewFiles[0]

      // const optimizedFile = await optimizeImageClient(originalFile, {
      //   maxWidth: 800,
      //   quality: 0.85,
      // })

      const fileName = `${crypto.randomUUID()}.webp`

      const { error } = await supabase.storage
        .from('uploads')
        .upload(fileName, originalFile, {
          contentType: 'image/webp',
          upsert: true,
        })

      if (error) {
        return imagePath
      }

      const { data } = supabase.storage.from('uploads').getPublicUrl(fileName)

      imagePath = data.publicUrl

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
