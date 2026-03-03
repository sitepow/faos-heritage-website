'use client'

import { useDisclosure, Button } from '@heroui/react'
import { PlusIcon, ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useCallback, useState } from 'react'

import type { Selection } from '@heroui/react'

import { BlogCategoryTable } from './_components/BlogCategoryTable'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { TableConfigHeader } from '@/app/(dashboard)/dashboard/products/_components/TableConfigHeader'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import {
  useBlogCategories,
  useBlogCategoryStat,
} from '@/features/blog-category/blog-category.hook'
import { useBlogCategoryMutation } from '@/features/blog-category/blog-category.mutation'
import { useBlogCategoryUIStore } from '@/features/blog-category/blog-category.store'
import { BlogCategoryForm } from '@/features/blog-category/ui/BlogCategoryForm'

const BlogCategoryPage = () => {
  const router = useRouter()
  const { openForm } = useBlogCategoryUIStore()
  const { remove, isDeleting } = useBlogCategoryMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: categories, isLoading } = useBlogCategories()
  const categoryList = useMemo(
    () => (categories?.data ? categories.data : []),
    [categories],
  )
  const { data: stats } = useBlogCategoryStat()
  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return categoryList.length
    }

    return selectedKeys.size
  }, [selectedKeys, categoryList])

  const selectedCategoryIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return categoryList.map((c) => c?.id!)
    }

    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, categoryList])

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
            เพิ่มหมวดหมู่บทความ
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
            <h1 className='text-2xl font-bold'>จัดการหมวดหมู่บทความ</h1>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedCategoryIds)}
      />

      <BlogCategoryTable
        categoryList={categoryList}
        isLoading={isLoading}
        selectedKeys={selectedKeys}
        onDeleteClick={handleDeleteTrigger}
        onEditClick={(id) => openForm(id)}
        onSelectionChange={setSelectedKeys}
      />

      <BlogCategoryForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default BlogCategoryPage
