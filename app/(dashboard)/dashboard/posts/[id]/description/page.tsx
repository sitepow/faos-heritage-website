/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Button, Spinner } from '@heroui/react'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

import type { PostInput } from '@/features/post/post.schema'

import { TableConfigHeader } from '../../../products/_components/TableConfigHeader'

import { Container } from '@/components/layouts/Container'
import { MdEditorCustomize } from '@/components/ui/MdEditorCustomize'
import { usePostAdmin } from '@/features/post/post.hook'
import { usePostMutation } from '@/features/post/post.mutation'

const PostDescriptionPage = () => {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [content, setContent] = useState<string>('')
  const [loadCount, setLoadCount] = useState(0)

  const { data: post, isLoading } = usePostAdmin(postId, !!postId)
  const { update, isUpdating } = usePostMutation()

  useEffect(() => {
    if (post?.success && post.data?.id === postId) {
      setContent(post.data.content || '')
      setLoadCount((prev) => prev + 1)
    }
  }, [post?.success, postId])

  const handleSave = useCallback(async () => {
    if (!postId || !post?.success || !post.data) {
      return
    }

    const postData = post.data

    const payload: PostInput = {
      id: postId,
      title: postData.title,
      slug: postData.slug,
      content: content,
      summary: postData.summary ?? '',
      featuredImage: postData.featuredImage ?? '',
      status: postData.status,
      isFeatured: postData.isFeatured,
      viewCount: postData.viewCount,
      categoryId: postData.categoryId || null,
      tagIds: postData.tags?.map((tag: { id: string }) => tag.id) ?? [],
      keywords: postData.keywords ?? [],
      metaTitle: postData.metaTitle ?? '',
      metaDescription: postData.metaDescription ?? '',
      publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : null,
    }

    await update(payload, {
      onSuccess: () => {
        router.push('/dashboard/posts')
      },
    })
  }, [postId, post, content, update, router])

  if (isLoading) {
    return (
      <Container className='flex justify-center p-20'>
        <Spinner label='กำลังโหลดข้อมูล...' />
      </Container>
    )
  }

  return (
    <Container className='flex flex-col gap-6'>
      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            isLoading={isUpdating}
            startContent={!isUpdating && <SaveIcon size={18} />}
            onPress={handleSave}
          >
            บันทึกเนื้อหาบทความ
          </Button>
        }
        selectedCount={0}
        title={
          <div className='flex items-center gap-3'>
            <Button isIconOnly variant='light' onPress={() => router.back()}>
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>แก้ไขเนื้อหาบทความ</h1>
              <p className='text-small text-default-500'>
                {post?.success ? post.data.title : 'ไม่พบข้อมูลบทความ'}
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => {}}
      />

      <MdEditorCustomize
        key={loadCount}
        placeholder='เริ่มเขียนเนื้อหาบทความของคุณที่นี่ (รองรับ Markdown)...'
        value={content}
        onChange={(val) => setContent(val)}
      />
    </Container>
  )
}

export default PostDescriptionPage
