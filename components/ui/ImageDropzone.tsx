/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
'use client'

import { Button } from '@heroui/react'
import { ImageIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import prettyBytes from 'pretty-bytes'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { IMAGE_ACCEPT_TYPES } from '@/constants'
import { cn } from '@/utils'

type ImageWithPreview = File & {
  preview: string
}

interface ImageDropzoneProps {
  multiple?: boolean
  onFilesChange?: (files: ImageWithPreview[]) => void
}

const createPreviewFiles = (files: File[]): ImageWithPreview[] =>
  files.map(
    (file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as ImageWithPreview,
  )

const ImageDropzone = ({
  multiple = false,
  onFilesChange,
}: ImageDropzoneProps) => {
  const t = useTranslations('Common.ImageDropzone')
  const [files, setFiles] = useState<ImageWithPreview[]>([])

  const updateFiles = useCallback(
    (updater: (prev: ImageWithPreview[]) => ImageWithPreview[]) => {
      setFiles((prev) => {
        const next = updater(prev)
        onFilesChange?.(next)
        return next
      })
    },
    [onFilesChange],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = createPreviewFiles(acceptedFiles)

      updateFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles))
    },
    [multiple, updateFiles],
  )

  const removeFile = useCallback(
    (target: ImageWithPreview) => {
      URL.revokeObjectURL(target.preview)

      updateFiles((prev) =>
        prev.filter((item) => item.preview !== target.preview),
      )
    },
    [updateFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': IMAGE_ACCEPT_TYPES },
    multiple,
  })

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  return (
    <div className='flex flex-col gap-4'>
      {files.length > 0 && (
        <div className={cn('grid gap-4', multiple && 'grid-cols-2')}>
          {files.map((file) => (
            <div
              key={file.preview}
              className='group relative flex flex-col gap-1'
            >
              <img
                alt={file.name}
                className='max-h-96 min-h-40 w-full rounded-lg object-cover'
                src={file.preview}
              />

              <Button
                className='absolute top-2 right-2'
                startContent={<XIcon className='text-default-500 size-4' />}
                variant='faded'
                onPress={() => removeFile(file)}
              />

              <p className='text-default-500 line-clamp-1 text-xs'>
                {file.name} ({prettyBytes(file.size)})
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-64 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition',
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-gray-400',
        )}
      >
        <input {...getInputProps()} />

        <div className='flex flex-col items-center gap-3 p-8 text-center'>
          <div
            className={cn(
              'rounded-full p-4 transition-colors',
              isDragActive && 'bg-primary/25',
            )}
          >
            <ImageIcon
              className={cn(
                'text-default-500 size-12',
                isDragActive && 'text-primary',
              )}
            />
          </div>

          {isDragActive ? (
            <p className='text-primary'>{t('active')}</p>
          ) : (
            <div className='flex flex-col gap-1'>
              <p className='font-medium'>{t('idle')}</p>

              <p className='text-default-500 text-sm'>{t('hint')}</p>

              <p className='text-primary text-sm font-semibold'>
                {t('limit', { size: '50 MB' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ImageDropzone }
export type { ImageWithPreview }
