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
  const { id: postId } = useParams<{ id: string }>()
  const router = useRouter()

  const [content, setContent] = useState<string>('')
  const [loadCount, setLoadCount] = useState(0)

  const { data: post, isLoading } = usePostAdmin(postId, !!postId)
  const { update, isUpdating } = usePostMutation()

  useEffect(() => {
    if (post && post.id === postId) {
      setContent(post.content || '')
      setLoadCount((prev) => prev + 1)
    }
  }, [post, postId])

  const handleSave = useCallback(async () => {
    if (!postId || !post) {
      return
    }

    await update(
      {
        ...post,
        id: postId,
        content: content,
        tagIds: post.tags?.map((tag: { id: string }) => tag.id) ?? [],
        categoryId: post.categoryId || null,
      } as PostInput,
      {
        onSuccess: () => {
          router.push('/dashboard/posts')
        },
      },
    )
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
                {post ? post.title : 'ไม่พบข้อมูลบทความ'}
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
