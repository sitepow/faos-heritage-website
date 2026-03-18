'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { PostTable } from './_components/PostTable'
import { PostForm } from '../../../../features/post/ui/PostForm'
import { TableConfigHeader } from '../products/_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { AlertSeoBestPractice } from '@/components/ui/AlertSeoBestPractice'
import { StatCard } from '@/components/ui/StatCard'
import { usePostStats, usePostsAdmin } from '@/features/post/hook'
import { usePostMutation } from '@/features/post/mutation'
import { usePostUIStore } from '@/features/post/store'
import { useIsMounted } from '@/hooks/useIsMounted'

const PostPage = () => {
  const isMounted = useIsMounted()
  const { openForm } = usePostUIStore()
  const { remove, isDeleting } = usePostMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [page, setPage] = useState(1)
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = usePostStats()
  const { data: postsData } = usePostsAdmin(page, 50)

  const postList = useMemo(() => {
    return postsData?.items ?? []
  }, [postsData])

  const statsData = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return postList.length
    }

    return selectedKeys.size
  }, [selectedKeys, postList])

  const selectedPostIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return postList.map((p) => p.id)
    }

    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, postList])

  const handleDeleteTrigger = useCallback(
    (id: string | string[]) => {
      setTargetDeleteId(id)
      onOpen()
    },
    [onOpen],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!targetDeleteId) {
      return
    }

    await remove(targetDeleteId)
    onOpenChange()
    setTargetDeleteId(null)
    setSelectedKeys(new Set([]))
  }, [targetDeleteId, remove, onOpenChange])

  if (!isMounted) {
    return null
  }

  return (
    <Container className='flex flex-col gap-6'>
      <AlertSeoBestPractice />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat: { name: string; value: number }) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <TableConfigHeader
        actionContent={
          <Button
            className='text-secondary font-bold'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => openForm()}
          >
            เขียนบทความใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title='จัดการบทความ'
        onDeleteSelected={() => handleDeleteTrigger(selectedPostIds)}
      />

      <PostTable
        page={page}
        selectedKeys={selectedKeys}
        onDeleteClick={handleDeleteTrigger}
        onPageChange={setPage}
        onSelectionChange={setSelectedKeys}
      />

      <PostForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default PostPage
