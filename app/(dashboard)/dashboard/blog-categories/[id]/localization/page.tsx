'use client'

import { useDisclosure, Button, Spinner } from '@heroui/react'
import { PlusIcon, ChevronLeftIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { BlogCategoryLocalizationTable } from '../../_components/BlogCategoryLocalizationTable'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { TableConfigHeader } from '@/app/(dashboard)/dashboard/products/_components/TableConfigHeader'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useBlogCategory } from '@/features/blog-category/blog-category.hook'
import { useBlogCategoryUIStore } from '@/features/blog-category/blog-category.store'
import {
  useBlogCategoryLocales,
  useBlogCategoryLocaleStat,
} from '@/features/blog-category-localization/blog-category-localization.hook'
import { useBlogCategoryLocaleMutation } from '@/features/blog-category-localization/blog-category-localization.mutation'
import { BlogCategoryLocaleForm } from '@/features/blog-category-localization/ui/BlogCategoryLocaleForm'

const BlogCategoryLocalizationPage = () => {
  const { id: blogCategoryId } = useParams<{ id: string }>()
  const router = useRouter()

  const { openForm } = useBlogCategoryUIStore()
  const { remove, isDeleting } = useBlogCategoryLocaleMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: response, isLoading: isLoadingCategory } = useBlogCategory({
    id: blogCategoryId,
  })
  const category = response?.data
  const { data: stats } = useBlogCategoryLocaleStat(blogCategoryId)
  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const { data: localizations } = useBlogCategoryLocales(blogCategoryId)
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
              onPress={() => router.push('/dashboard/blog-categories')}
            >
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>จัดการภาษา (Localization)</h1>
              <p>ต้นฉบับ: {category?.name}</p>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedLocaleIds)}
      />

      <BlogCategoryLocalizationTable
        blogCategoryId={blogCategoryId}
        getActionItems={getActionItems}
        originalName={category?.name || ''}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <BlogCategoryLocaleForm blogCategoryId={blogCategoryId} />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default BlogCategoryLocalizationPage
