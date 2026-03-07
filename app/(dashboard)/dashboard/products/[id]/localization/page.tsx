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

import { ProductLocalizationTable } from '../../_components/ProductLocalizationTable'
import { TableConfigHeader } from '../../_components/TableConfigHeader'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { Container } from '@/components/layouts/Container'
import { AlertSeoBestPractice } from '@/components/ui/AlertSeoBestPractice'
import { StatCard } from '@/components/ui/StatCard'
import { useProductAdmin } from '@/features/product/product.hook'
import { useProductUIStore } from '@/features/product/product.store'
import {
  useProductLocales,
  useProductLocaleStat,
} from '@/features/product-localization/product-localization.hook'
import { useProductLocaleMutation } from '@/features/product-localization/product-localization.mutation'
import { useProductLocaleUIStore } from '@/features/product-localization/product-localization.store'
import { ProductLocalizationForm } from '@/features/product-localization/ui/ProductLocalizationForm'

const ProductLocalizationPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { openForm: setParentId } = useProductUIStore()
  const { openForm: openLocaleForm } = useProductLocaleUIStore()
  const { remove, isDeleting } = useProductLocaleMutation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data: stats } = useProductLocaleStat(productId)
  const { data: product } = useProductAdmin(productId, true)
  const { data: localizations } = useProductLocales(productId)

  const isProductData = product && 'id' in product
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
    (localeId: string) => [
      {
        key: 'edit',
        label: 'แก้ไขการแปล',
        icon: <EditIcon size={16} />,
        onClick: () => openLocaleForm(localeId),
      },
      {
        key: 'description',
        label: 'แก้ไขรายละเอียดเนื้อหา',
        icon: <FileTextIcon size={16} />,
        onClick: () =>
          router.push(
            `/dashboard/products/${productId}/localization/${localeId}/description`,
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
    [productId, openLocaleForm, handleDeleteTrigger, router],
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
            <Button isIconOnly variant='light' onPress={() => router.back()}>
              <ChevronLeftIcon size={24} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>จัดการภาษา (Localization)</h1>
              <p className='text-small text-default-500'>
                ต้นฉบับ: {isProductData ? product.name : 'ไม่พบข้อมูลสินค้า'}
              </p>
            </div>
          </div>
        }
        onDeleteSelected={() => handleDeleteTrigger(selectedLocaleIds)}
      />

      <ProductLocalizationTable
        getActionItems={getActionItems}
        originalName={isProductData ? product.name : ''}
        productId={productId}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <ProductLocalizationForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </Container>
  )
}

export default ProductLocalizationPage
