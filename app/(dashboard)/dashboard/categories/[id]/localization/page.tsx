'use client'

import { useDisclosure, Button, Spinner } from '@heroui/react'
import { PlusIcon, ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { CategoryLocalizationTable } from '../../_components/CategoryLocalizationTable'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { TableConfigHeader } from '@/app/(dashboard)/dashboard/products/_components/TableConfigHeader'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useCategory } from '@/features/category/category.hook'
import { useCategoryUIStore } from '@/features/category/category.store'
import {
  useCategoryLocales,
  useCategoryLocaleStat,
} from '@/features/category-localization/category-localization.hook'
import { useCategoryLocaleMutation } from '@/features/category-localization/category-localization.mutation'
import { CategoryLocaleForm } from '@/features/category-localization/ui/CategoryLocaleForm'

const CategoryLocalizationPage = () => {
  const { id: categoryId } = useParams<{ id: string }>()
  const router = useRouter()

  const { openForm } = useCategoryUIStore()
  const { remove, isDeleting } = useCategoryLocaleMutation(categoryId)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: category, isLoading: isLoadingCategory } = useCategory({
    categoryId,
  })
  const { data: localizations } = useCategoryLocales(categoryId)
  const { data: stats } = useCategoryLocaleStat(categoryId)
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

  if (isLoadingCategory) {
    return (
      <Container className='flex justify-center p-20'>
        <Spinner label='กำลังโหลดข้อมูลหมวดหมู่...' />
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
              onPress={() => router.push('/dashboard/categories')}
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>
                จัดการภาษา: {category?.name}
              </h1>
              <p className='text-small text-default-500'>
                จัดการคำแปลชื่อหมวดหมู่สำหรับภาษาต่างๆ
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedLocaleIds)}
      />

      <CategoryLocalizationTable
        categoryId={categoryId}
        getActionItems={getActionItems}
        originalName={category?.name || ''}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <CategoryLocaleForm categoryId={categoryId} />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default CategoryLocalizationPage
