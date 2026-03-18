'use client'

import { useDisclosure, Button, Spinner } from '@heroui/react'
import { PlusIcon, ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { TagLocalizationTable } from '../../_components/TagLocalizationTable'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { TableConfigHeader } from '@/app/(dashboard)/dashboard/products/_components/TableConfigHeader'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useTag } from '@/features/tag/hook'
import { useTagUIStore } from '@/features/tag/store'
import {
  useTagLocales,
  useTagLocaleStat,
} from '@/features/tag-localization/hook'
import { useTagLocaleMutation } from '@/features/tag-localization/mutation'
import { TagLocaleForm } from '@/features/tag-localization/ui/TagLocaleForm'

const TagLocalizationPage = () => {
  const params = useParams()
  const router = useRouter()
  const tagId = params.id as string

  const { openForm } = useTagUIStore()
  const { remove, isDeleting } = useTagLocaleMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = useTagLocaleStat(tagId)
  const { data: tag, isLoading: isLoadingTag } = useTag(tagId)
  const { data: localizations } = useTagLocales(tagId)

  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const localeList = useMemo(
    () => (Array.isArray(localizations) ? localizations : []),
    [localizations],
  )

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

    onOpenChange()
    setTargetDeleteId(null)
    setSelectedKeys(new Set([]))
  }, [targetDeleteId, remove, onOpenChange])

  const getActionItems = useCallback(
    (id: string) => [
      {
        key: 'edit',
        label: 'แก้ไขคำแปล',
        icon: null,
        onClick: () => openForm(id),
      },
      {
        key: 'delete',
        label: 'ลบภาษา',
        icon: null,
        isDanger: true,
        onClick: () => handleDeleteTrigger(id),
      },
    ],
    [openForm, handleDeleteTrigger],
  )

  if (isLoadingTag) {
    return (
      <Container className='flex justify-center p-20'>
        <Spinner label='กำลังโหลดข้อมูลแท็ก...' />
      </Container>
    )
  }

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
            เพิ่มภาษา
          </Button>
        }
        selectedCount={selectedCount}
        title={
          <div className='flex items-center gap-3'>
            <Button
              isIconOnly
              variant='light'
              onPress={() => router.push('/dashboard/tags')}
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>จัดการภาษา (Localization)</h1>
              <p className='text-small text-default-500'>
                ต้นฉบับ: {tag?.name}
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedLocaleIds)}
      />

      <TagLocalizationTable
        getActionItems={getActionItems}
        originalName={tag?.name || ''}
        selectedKeys={selectedKeys}
        tagId={tagId}
        onSelectionChange={setSelectedKeys}
      />

      <TagLocaleForm tagId={tagId} />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default TagLocalizationPage
