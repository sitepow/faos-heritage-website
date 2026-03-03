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
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { PostInput } from '@/features/post/post.schema'
import type { KeyboardEvent } from 'react'
import type { Resolver } from 'react-hook-form'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { usePostAdmin } from '@/features/post/post.hook'
import { usePostMutation } from '@/features/post/post.mutation'
import { postSchema } from '@/features/post/post.schema'
import { usePostUIStore } from '@/features/post/post.store'
import { useTags } from '@/features/tag/tag.hook'

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
  const { selectedPostId, isFormOpen, closeForm } = usePostUIStore()
  const { create, update, isCreating, isUpdating } = usePostMutation()

  const [inputValue, setInputValue] = useState('')

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
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema) as Resolver<PostInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const keywords = watch('keywords') || []

  useEffect(() => {
    if (isFormOpen) {
      if (selectedPostId && post) {
        reset({
          ...post,
          categoryId: post.categoryId || null,
          tagIds: post.tags?.map((tag) => tag.id) ?? [],
          keywords: post.keywords ?? [],
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
        } as PostInput)
      } else if (!selectedPostId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedPostId, post, reset])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      const value = inputValue.trim()

      if (value && !keywords.includes(value)) {
        const newKeywords = [...keywords, value]
        setValue('keywords', newKeywords, { shouldDirty: true })
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      const newKeywords = [...keywords]
      newKeywords.pop()
      setValue('keywords', newKeywords, { shouldDirty: true })
    }
  }

  const removeKeyword = (indexToRemove: number) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove)
    setValue('keywords', newKeywords, { shouldDirty: true })
  }

  const onSubmit = async (data: PostInput) => {
    if (selectedPostId) {
      await update({ ...data, id: selectedPostId })
    } else {
      await create(data)
    }
    closeForm()
  }

  const isPending = isLoadingPost || isCreating || isUpdating

  return (
    <Modal
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={closeForm}
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
                        errorMessage={errors.title?.message}
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
                        errorMessage={errors.slug?.message}
                        isInvalid={!!errors.slug}
                        label='URL Slug'
                        variant='bordered'
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name='featuredImage'
                    render={({ field }) => (
                      <Input
                        {...field}
                        className='md:col-span-2'
                        label='รูปภาพหน้าปก (URL)'
                        value={field.value || ''}
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
                          key={`${keyword}-${index}`}
                          className='bg-primary/10 text-primary border-primary/20 border-1'
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
                          label='Meta Title (SEO)'
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
                          label='Meta Description (SEO)'
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
            <Button variant='flat' onPress={closeForm}>
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
