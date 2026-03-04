/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
'use client'

import { Button } from '@heroui/react'
import { ImageIcon, XIcon } from 'lucide-react'
import prettyBytes from 'pretty-bytes'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { IMAGE_ACCEPT_TYPES } from '@/constants'
import { cn } from '@/utils'

type ImageWithPreview = File & { preview: string }

interface Props {
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

const ImageDropzone = ({ multiple = false, onFilesChange }: Props) => {
  const [files, setFiles] = useState<ImageWithPreview[]>([])

  useEffect(() => {
    onFilesChange?.(files)
  }, [files, onFilesChange])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = createPreviewFiles(acceptedFiles)
      setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles))
    },
    [multiple],
  )

  const removeFile = useCallback((target: ImageWithPreview) => {
    URL.revokeObjectURL(target.preview)
    setFiles((prev) => prev.filter((item) => item.preview !== target.preview))
  }, [])

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': IMAGE_ACCEPT_TYPES },
    multiple,
  })

  return (
    <div className='flex flex-col gap-4 text-left'>
      {files.length > 0 && (
        <div
          className={cn('grid gap-4', multiple ? 'grid-cols-2' : 'grid-cols-1')}
        >
          {files.map((file) => (
            <div
              key={file.preview}
              className='group relative flex flex-col gap-1'
            >
              <img
                alt={file.name}
                className='max-h-96 min-h-40 w-full rounded-lg object-cover shadow-sm'
                src={file.preview}
              />
              <Button
                isIconOnly
                className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm'
                radius='full'
                size='sm'
                variant='flat'
                onPress={() => removeFile(file)}
              >
                <XIcon className='text-danger size-4' />
              </Button>
              <div className='px-1'>
                <p className='text-default-500 line-clamp-1 text-[10px] font-medium'>
                  {file.name}
                </p>
                <p className='text-default-400 text-[10px]'>
                  {prettyBytes(file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-48 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-default-200 hover:border-primary/50',
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center gap-3 p-8 text-center'>
          <div
            className={cn(
              'bg-default-100 flex h-14 w-14 items-center justify-center rounded-full transition-colors',
              isDragActive && 'bg-primary/20',
            )}
          >
            <ImageIcon
              className={cn(
                'text-default-400 size-7',
                isDragActive && 'text-primary',
              )}
            />
          </div>

          {isDragActive ? (
            <p className='text-primary font-medium'>วางรูปภาพที่นี่ได้เลย</p>
          ) : (
            <div className='flex flex-col gap-1'>
              <p className='text-default-700 font-bold'>
                คลิกเพื่อเลือกรูปภาพ หรือลากมาวาง
              </p>
              <p className='text-default-400 text-xs'>
                รองรับไฟล์ภาพมาตรฐานทั่วไป (JPG, PNG, WEBP)
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
