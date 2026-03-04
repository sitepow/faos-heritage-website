/* eslint-disable react/no-array-index-key */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Switch,
  Input,
  Select,
  SelectItem,
  ModalFooter,
  Button,
  Textarea,
  Spinner,
  Chip,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostStatus } from '@prisma/client'
import { useEffect, useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { PostInput } from '@/features/post/post.schema'
import type { KeyboardEvent } from 'react'
import type { Resolver } from 'react-hook-form'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { usePostAdmin } from '@/features/post/post.hook'
import { usePostMutation } from '@/features/post/post.mutation'
import { postSchema } from '@/features/post/post.schema'
import { usePostUIStore } from '@/features/post/post.store'
import { useTags } from '@/features/tag/tag.hook'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const DEFAULT_VALUES: PostInput = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  featuredImage: '',
  status: PostStatus.DRAFT,
  isFeatured: false,
  categoryId: '',
  tagIds: [],
  viewCount: 0,
  keywords: [],
  metaTitle: '',
  metaDescription: '',
}

const PostForm = () => {
  const {
    selectedPostId,
    isFormOpen,
    closeForm,
    reset: resetUIStore,
  } = usePostUIStore()
  const { create, update, isCreating, isUpdating } = usePostMutation()

  const [inputValue, setInputValue] = useState('')

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)

  const { resolveImagePath, isUploading } = useResolveImageUpload({
    oldImage,
    previewFiles,
  })

  const { data: categoriesRes } = useBlogCategories({})
  const categories = categoriesRes?.success ? categoriesRes.data : []

  const { data: tags } = useTags()

  const { data: post, isLoading: isLoadingPost } = usePostAdmin(
    selectedPostId || '',
    isFormOpen,
  )

  const {
    control,
    handleSubmit,
    reset: resetForm,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema) as Resolver<PostInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const keywords = watch('keywords') || []

  const handleClose = useCallback(() => {
    closeForm()
    resetUIStore()
    setPreviewFiles([])
    setOldImage(null)
    setInputValue('')
    resetForm(DEFAULT_VALUES)
  }, [closeForm, resetUIStore, resetForm])

  useEffect(() => {
    if (isFormOpen) {
      if (selectedPostId && post) {
        resetForm({
          ...post,
          categoryId: post.categoryId || null,
          tagIds: post.tags?.map((tag) => tag.id) ?? [],
          keywords: post.keywords ?? [],
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          featuredImage: post.featuredImage || '',
        } as PostInput)
        setOldImage(post.featuredImage || null)
      } else if (!selectedPostId) {
        resetForm(DEFAULT_VALUES)
        setPreviewFiles([])
        setOldImage(null)
      }
    }
  }, [isFormOpen, selectedPostId, post, resetForm])

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    if (files.length > 0) {
      setValue('featuredImage', 'IMAGE_CHANGED', { shouldDirty: true })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      const value = inputValue.trim()
      if (value && !keywords.includes(value)) {
        setValue('keywords', [...keywords, value], { shouldDirty: true })
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      const newKeywords = [...keywords]
      newKeywords.pop()
      setValue('keywords', newKeywords, { shouldDirty: true })
    }
  }

  const removeKeyword = (indexToRemove: number) => {
    setValue(
      'keywords',
      keywords.filter((_, i) => i !== indexToRemove),
      { shouldDirty: true },
    )
  }

  const onSubmit = async (data: PostInput) => {
    const imagePath = await resolveImagePath()
    const finalData = { ...data, featuredImage: imagePath }

    if (selectedPostId) {
      await update({ ...finalData, id: selectedPostId })
    } else {
      await create(finalData)
    }
    handleClose()
  }

  const isPending = isLoadingPost || isCreating || isUpdating || isUploading

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={(open) => !open && handleClose()}
    >
      <ModalContent>
        <form className='overflow-y-scroll' onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='text-xl font-bold'>
            {selectedPostId ? 'แก้ไขข้อมูลพื้นฐานบทความ' : 'เขียนบทความใหม่'}
          </ModalHeader>
          <ModalBody>
            {isLoadingPost && selectedPostId ? (
              <div className='flex justify-center p-8'>
                <Spinner label='กำลังโหลดข้อมูล...' />
              </div>
            ) : (
              <div className='space-y-6'>
                <SectionLabel>รูปหน้าปกบทความ</SectionLabel>
                <ImageDropzone onFilesChange={onFilesChange} />

                <SectionLabel>สถานะและการแสดงผล</SectionLabel>
                <div className='flex flex-wrap gap-6'>
                  <Controller
                    control={control}
                    name='status'
                    render={({ field: { value, onChange } }) => (
                      <Select
                        className='max-w-xs'
                        label='สถานะบทความ'
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) =>
                          onChange(Array.from(keys)[0] as PostStatus)
                        }
                      >
                        <SelectItem key={PostStatus.DRAFT}>ฉบับร่าง</SelectItem>
                        <SelectItem key={PostStatus.PUBLISHED}>
                          เผยแพร่
                        </SelectItem>
                        <SelectItem key={PostStatus.ARCHIVED}>
                          เก็บถาวร
                        </SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name='isFeatured'
                    render={({ field: { value, onChange } }) => (
                      <Switch isSelected={!!value} onValueChange={onChange}>
                        บทความแนะนำ (Featured)
                      </Switch>
                    )}
                  />
                </div>

                <SectionLabel>ข้อมูลเนื้อหา</SectionLabel>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Controller
                    control={control}
                    name='title'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.title?.message?.toString()}
                        isInvalid={!!errors.title}
                        label='หัวข้อบทความ'
                        variant='bordered'
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name='slug'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.slug?.message?.toString()}
                        isInvalid={!!errors.slug}
                        label='URL Slug'
                        variant='bordered'
                      />
                    )}
                  />
                </div>

                <SectionLabel>การจัดกลุ่มและแท็ก</SectionLabel>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Controller
                    control={control}
                    name='categoryId'
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='หมวดหมู่บทความ'
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) =>
                          onChange((Array.from(keys)[0] as string) || null)
                        }
                      >
                        {categories.map((cat) => (
                          <SelectItem key={cat?.id!}>{cat?.name!}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name='tagIds'
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='แท็กบทความ'
                        selectedKeys={new Set(value)}
                        selectionMode='multiple'
                        variant='bordered'
                        onSelectionChange={(keys) => onChange(Array.from(keys))}
                      >
                        {(tags || []).map((tag) => (
                          <SelectItem key={tag?.id!}>{tag?.name!}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                <SectionLabel>SEO และ Keywords</SectionLabel>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <Input
                      label='คีย์เวิร์ด (กด , หรือ Enter เพื่อเพิ่ม)'
                      placeholder='เช่น สุขภาพ, อาหาร'
                      value={inputValue}
                      variant='bordered'
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className='flex flex-wrap gap-2 px-1'>
                      {keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          color='primary'
                          variant='flat'
                          onClose={() => removeKeyword(index)}
                        >
                          {keyword}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Controller
                      control={control}
                      name='metaTitle'
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.metaTitle?.message?.toString()}
                          isInvalid={!!errors.metaTitle}
                          label='Meta Title'
                          value={field.value || ''}
                          variant='bordered'
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name='metaDescription'
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.metaDescription?.message?.toString()}
                          isInvalid={!!errors.metaDescription}
                          label='Meta Description'
                          value={field.value || ''}
                          variant='bordered'
                        />
                      )}
                    />
                  </div>
                </div>

                <SectionLabel>สรุปเนื้อหาเบื้องต้น</SectionLabel>
                <Controller
                  control={control}
                  name='summary'
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      errorMessage={errors.summary?.message?.toString()}
                      isInvalid={!!errors.summary}
                      label='คำอธิบายสั้น (Summary)'
                      value={field.value || ''}
                      variant='bordered'
                    />
                  )}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={handleClose}>
              ยกเลิก
            </Button>
            <Button
              className='text-secondary font-bold'
              color='primary'
              isDisabled={!isDirty}
              isLoading={isPending}
              type='submit'
            >
              {selectedPostId ? 'บันทึกการแก้ไข' : 'สร้างบทความ'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { PostForm }
