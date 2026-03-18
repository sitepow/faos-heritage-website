'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon, ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { TagTable } from './_components/TagTable'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { TableConfigHeader } from '@/app/(dashboard)/dashboard/products/_components/TableConfigHeader'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useTags, useTagStat } from '@/features/tag/hook'
import { useTagMutation } from '@/features/tag/mutation'
import { useTagUIStore } from '@/features/tag/store'
import { TagForm } from '@/features/tag/ui/TagForm'

const TagPage = () => {
  const router = useRouter()
  const { openForm } = useTagUIStore()
  const { remove, isDeleting } = useTagMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = useTagStat()
  const { data: tags } = useTags()
  const tagList = useMemo(() => (Array.isArray(tags) ? tags : []), [tags])
  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return tagList.length
    }

    return selectedKeys.size
  }, [selectedKeys, tagList])

  const selectedTagIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return tagList.map((t) => t?.id!)
    }

    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, tagList])

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

  return (
    <Container className='flex flex-col gap-6'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData.map((stat) => (
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
            เพิ่มแท็กใหม่
          </Button>
        }
        selectedCount={selectedCount}
        title={
          <div className='flex items-center gap-3'>
            <Button
              isIconOnly
              variant='light'
              onPress={() => router.push('/dashboard/posts')}
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <h1 className='text-2xl font-bold'>จัดการแท็กบทความ</h1>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedTagIds)}
      />

      <TagTable
        selectedKeys={selectedKeys}
        onDeleteClick={handleDeleteTrigger}
        onSelectionChange={setSelectedKeys}
      />

      <TagForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default TagPage
