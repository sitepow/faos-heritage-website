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
  Alert,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostStatus } from '@prisma/client'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { PostInput } from '@/features/post/post.schema'
import type { Resolver } from 'react-hook-form'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { usePostAdmin } from '@/features/post/post.hook'
import { usePostMutation } from '@/features/post/post.mutation'
import { postSchema } from '@/features/post/post.schema'
import { usePostUIStore } from '@/features/post/post.store'

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
}

const PostForm = () => {
  const { selectedPostId, isFormOpen, closeForm } = usePostUIStore()
  const { create, update, isCreating, isUpdating } = usePostMutation()

  const { data: categoriesRes } = useBlogCategories({})
  const categories = categoriesRes?.success ? categoriesRes.data : []

  const { data: postRes, isLoading: isLoadingPost } = usePostAdmin(
    selectedPostId || '',
    isFormOpen,
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema) as Resolver<PostInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedPostId && postRes?.success && postRes.data) {
        const rawPost = postRes.data

        const formattedData: PostInput = {
          id: rawPost.id,
          title: rawPost.title,
          slug: rawPost.slug,
          summary: rawPost.summary ?? '',
          content: rawPost.content ?? '',
          featuredImage: rawPost.featuredImage ?? '',
          status: rawPost.status as PostStatus,
          isFeatured: rawPost.isFeatured,
          viewCount: rawPost.viewCount,
          categoryId: rawPost.categoryId || null,
          keywords: rawPost.keywords ?? [],
          tagIds: rawPost.tags?.map((tag: { id: string }) => tag.id) ?? [],
          metaTitle: rawPost.metaTitle ?? '',
          metaDescription: rawPost.metaDescription ?? '',
          publishedAt: rawPost.publishedAt
            ? new Date(rawPost.publishedAt)
            : null,
        }

        reset(formattedData)
      } else if (!selectedPostId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedPostId, postRes, reset])

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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                        placeholder='เช่น how-to-coding'
                        variant='bordered'
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name='categoryId'
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='หมวดหมู่บทความ'
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) => {
                          const val = Array.from(keys)[0] as string
                          onChange(val || null)
                        }}
                      >
                        {categories.map((cat) => (
                          <SelectItem key={cat?.id!}>{cat?.name!}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name='featuredImage'
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='รูปภาพหน้าปก (URL)'
                        value={field.value || ''}
                        variant='bordered'
                      />
                    )}
                  />
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

                <Alert color='primary' variant='flat'>
                  สำหรับการเขียนเนื้อหาบทความแบบละเอียด (MDX)
                  คุณสามารถจัดการได้ผ่านเมนู &quot;แก้ไขเนื้อหาบทความ&quot;
                  ในหน้าตารางหลังจากบันทึกข้อมูลส่วนนี้แล้ว
                </Alert>
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
