'use client'

import { Button, useDisclosure } from '@heroui/react'
import {
  ChevronLeftIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  FileTextIcon,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useCallback, useState, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { TableConfigHeader } from '../../../products/_components/TableConfigHeader'
import { PostLocalizationTable } from '../../_components/PostLocalizationTable'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { AlertSeoBestPractice } from '@/components/ui/AlertSeoBestPractice'
import { StatCard } from '@/components/ui/StatCard'
import { usePostAdmin } from '@/features/post/hook'
import { usePostUIStore } from '@/features/post/store'
import {
  usePostLocales,
  usePostLocaleStat,
} from '@/features/post-localization/hook'
import { usePostLocaleMutation } from '@/features/post-localization/mutation'
import { usePostLocaleUIStore } from '@/features/post-localization/store'
import { PostLocalizationForm } from '@/features/post-localization/ui/PostLocalizationForm'

const PostLocalizationPage = () => {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const { openForm: setParentId } = usePostUIStore()
  const { openForm: openLocaleForm } = usePostLocaleUIStore()
  const { remove, isDeleting } = usePostLocaleMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = usePostLocaleStat(postId)
  const { data: post } = usePostAdmin(postId)
  const { data: localizations } = usePostLocales(postId)

  const localeList = useMemo(() => localizations || [], [localizations])
  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return localeList.length
    }

    return selectedKeys.size
  }, [selectedKeys, localeList])

  const selectedLocaleIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return localeList.map((l) => l.id)
    }

    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, localeList])

  useEffect(() => {
    if (postId) {
      setParentId(postId)
    }
  }, [postId, setParentId])

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

    const ids = Array.isArray(targetDeleteId)
      ? targetDeleteId
      : [targetDeleteId]
    await Promise.all(ids.map((id) => remove(id)))

    setTargetDeleteId(null)
    setSelectedKeys(new Set([]))
    onOpenChange()
  }, [targetDeleteId, remove, onOpenChange])

  const getActionItems = useCallback(
    (localeId: string) => [
      {
        key: 'edit',
        label: 'แก้ไขการแปล',
        icon: <EditIcon size={16} />,
        onClick: () => openLocaleForm(localeId),
      },
      {
        key: 'content',
        label: 'แก้ไขเนื้อหาบทความ',
        icon: <FileTextIcon size={16} />,
        onClick: () =>
          router.push(
            `/dashboard/posts/${postId}/localization/${localeId}/description`,
          ),
      },
      {
        key: 'delete',
        label: 'ลบข้อมูล',
        icon: <TrashIcon size={16} />,
        isDanger: true,
        onClick: () => handleDeleteTrigger(localeId),
      },
    ],
    [postId, openLocaleForm, handleDeleteTrigger, router],
  )

  return (
    <Container className='flex flex-col gap-6 text-left'>
      <AlertSeoBestPractice />

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
            onPress={() => openLocaleForm()}
          >
            เพิ่มการแปลภาษา
          </Button>
        }
        selectedCount={selectedCount}
        title={
          <div className='flex items-center gap-3'>
            <Button
              isIconOnly
              variant='light'
              onPress={() => router.push(`/dashboard/posts`)}
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>จัดการภาษา (Localization)</h1>
              <p className='text-small text-default-500'>
                ต้นฉบับ: {post?.title || 'ไม่พบข้อมูลบทความ'}
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedLocaleIds)}
      />

      <PostLocalizationTable
        getActionItems={getActionItems}
        originalTitle={post?.title || ''}
        postId={postId}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <PostLocalizationForm postId={postId!} />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default PostLocalizationPage
