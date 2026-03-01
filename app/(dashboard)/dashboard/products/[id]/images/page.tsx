'use client'

import { Button, Spinner, useDisclosure } from '@heroui/react'
import { ChevronLeftIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useCallback, useState, useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { ProductImageTable } from '../../_components/ProductImageTable'
import { TableConfigHeader } from '../../_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useProductAdmin } from '@/features/product/product.hook'
import { useProductUIStore } from '@/features/product/product.store'
import {
  useProductImages,
  useProductImageStat,
} from '@/features/product-image/product-image.hook'
import { useProductImageMutation } from '@/features/product-image/product-image.mutation'
import { useProductImageUIStore } from '@/features/product-image/product-image.store'
import { ProductImageForm } from '@/features/product-image/ui/ProductImageForm'

const ProductImagePage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { openForm: setParentId } = useProductUIStore()
  const { openForm: openImageForm } = useProductImageUIStore()
  const { remove, isDeleting } = useProductImageMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = useProductImageStat(productId)
  const { data: product, isLoading: isLoadingProduct } = useProductAdmin(
    productId,
    true,
  )
  const { data: images } = useProductImages(productId)

  const isProductData = product && 'id' in product
  const imageList = useMemo(() => images || [], [images])
  const statsData = useMemo(() => (Array.isArray(stats) ? stats : []), [stats])

  const selectedCount = useMemo(() => {
    if (selectedKeys === 'all') {
      return imageList.length
    }
    return selectedKeys.size
  }, [selectedKeys, imageList])

  const selectedImageIds = useMemo(() => {
    if (selectedKeys === 'all') {
      return imageList.map((img) => img.id)
    }
    return Array.from(selectedKeys) as string[]
  }, [selectedKeys, imageList])

  useEffect(() => {
    if (productId) {
      setParentId(productId)
    }
  }, [productId, setParentId])

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

    if (Array.isArray(targetDeleteId)) {
      await Promise.all(targetDeleteId.map((id) => remove(id)))
    } else {
      await remove(targetDeleteId)
    }

    setTargetDeleteId(null)
    setSelectedKeys(new Set([]))
    onOpenChange()
  }, [targetDeleteId, remove, onOpenChange])

  const getActionItems = useCallback(
    (imageId: string) => [
      {
        key: 'edit',
        label: 'แก้ไขข้อมูล',
        icon: <EditIcon size={16} />,
        onClick: () => openImageForm(imageId),
      },
      {
        key: 'delete',
        label: 'ลบรูปภาพ',
        icon: <TrashIcon size={16} />,
        isDanger: true,
        onClick: () => handleDeleteTrigger(imageId),
      },
    ],
    [openImageForm, handleDeleteTrigger],
  )

  if (isLoadingProduct) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner label='กำลังโหลดข้อมูลสินค้า...' />
      </div>
    )
  }

  return (
    <Container className='flex flex-col gap-6 text-left'>
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
            onPress={() => openImageForm()}
          >
            เพิ่มรูปภาพ
          </Button>
        }
        selectedCount={selectedCount}
        title={
          <div className='flex items-center gap-3'>
            <Button isIconOnly variant='light' onPress={() => router.back()}>
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <p className='text-small text-default-500'>
                จัดการรูปภาพสำหรับสินค้า:
              </p>
              <h1 className='text-2xl font-bold'>
                {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
              </h1>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedImageIds)}
      />

      <ProductImageTable
        getActionItems={getActionItems}
        productId={productId}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <ProductImageForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default ProductImagePage
