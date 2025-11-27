/* eslint-disable @next/next/no-img-element */
import { Button } from '@heroui/button'
import { ImageIcon, XIcon } from 'lucide-react'
import prettyBytes from 'pretty-bytes'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import type { FC } from 'react'

import { cn } from '@/utils/style'

const ACCEPT_TYPE = ['.png', '.jpg', '.jpeg', '.gif', '.webp']

interface Props {
  multiple?: boolean
  onFilesChange?: (files: ImageWithPreview[]) => void
}

interface ImageWithPreview extends File {
  preview: string
}

const ImageDropzone: FC<Props> = ({ multiple = false, onFilesChange }) => {
  const [files, setFiles] = useState<ImageWithPreview[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        setFiles((prevFiles) => {
          const newFiles = [
            ...prevFiles,
            ...acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            ),
          ]

          onFilesChange?.(newFiles)

          return newFiles
        })
      } else {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        )

        setFiles(newFiles)
        onFilesChange?.(newFiles)
      }
    },
    [multiple, onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ACCEPT_TYPE,
    },
    multiple,
  })

  const removeFile = (fileToRemove: ImageWithPreview) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove)

    setFiles(updatedFiles)
    URL.revokeObjectURL(fileToRemove.preview)
    onFilesChange?.(updatedFiles)
  }

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  return (
    <div className='flex flex-col gap-4'>
      {files.length > 0 && (
        <div className={cn('grid', multiple && 'grid-cols-2 gap-4')}>
          {files.map((file) => (
            <div key={file.name} className='group relative flex flex-col gap-1'>
              <img
                alt={file.name}
                className='h-40 w-full rounded-lg object-cover'
                src={file.preview}
              />
              <Button
                className='absolute top-2 right-2'
                startContent={<XIcon className='size-4 text-default-500' />}
                variant='faded'
                onPress={() => removeFile(file)}
              />
              <p className='line-clamp-1 text-xs text-default-500'>
                {file.name} ({prettyBytes(file.size)})
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-64 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed',
          isDragActive
            ? 'border-primary-website bg-primary-website/10'
            : 'border-gray-300 hover:border-gray-400',
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center gap-3 p-8 text-center'>
          <div
            className={cn(
              'rounded-full p-4 transition-colors',
              isDragActive && 'bg-primary-website/25',
            )}
          >
            <ImageIcon
              className={cn(
                'size-12 text-default-500',
                isDragActive && 'text-primary-website',
              )}
            />
          </div>
          {isDragActive ? (
            <p className='text-primary-website'>วางรูปภาพที่นี่...</p>
          ) : (
            <div className='flex flex-col'>
              <p className=''>ลากและวางรูปภาพที่นี่</p>
              <div className='mx-auto flex gap-1 text-sm text-default-500'>
                {ACCEPT_TYPE?.map((type, idx) => (
                  <p key={idx}>{type}</p>
                ))}
              </div>
              <p className='text-sm text-default-500'>
                หรือคลิกเพื่อเลือกไฟล์
                (ระบบจะปรับขนาดไฟล์ให้โดยอัตโนมัติเพื่อเพิ่ม Performance
                ของรูปภาพ)
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
