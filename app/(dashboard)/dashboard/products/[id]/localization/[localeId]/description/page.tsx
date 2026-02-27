'use client'

import { Button, Spinner } from '@heroui/react'
import { ChevronLeftIcon, SaveIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import type { ProductLocalizationInput } from '@/features/product-localization/product-localization.schema'

import { Container } from '@/components/layouts/Container'
import { MdEditorCustomize } from '@/components/ui/MdEditorCustomize'
import { useProductLocale } from '@/features/product-localization/product-localization.hook'
import { useProductLocaleMutation } from '@/features/product-localization/product-localization.mutation'

const ProductLocalizationDescriptionPage = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const localeId = params.localeId as string

  const [content, setContent] = useState<string>('')
  const [loadCount, setLoadCount] = useState(0)

  const { data: localization, isLoading } = useProductLocale(localeId)
  const { update, isUpdating } = useProductLocaleMutation()

  const isLocaleData = localization && 'id' in localization

  useEffect(() => {
    if (isLocaleData) {
      setContent(localization.description || '')
      setLoadCount((prev) => prev + 1)
    }
  }, [isLocaleData, localization])

  const handleSave = async () => {
    if (!localeId || !isLocaleData) {
      return
    }

    await update(
      {
        ...localization,
        id: localeId,
        description: content,
      } as ProductLocalizationInput,
      {
        onSuccess: () => {
          router.push(`/dashboard/products/${productId}/localization`)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner label='กำลังโหลดเนื้อหาภาษา...' />
      </div>
    )
  }

  return (
    <Container className='flex flex-col gap-5 text-left'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button isIconOnly variant='light' onPress={() => router.back()}>
            <ChevronLeftIcon size={24} />
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>
              แก้ไขรายละเอียดสินค้า ({localization?.languageCode?.toUpperCase()}
              )
            </h1>
            <p className='text-small text-default-500'>
              แปลสำหรับ: {localization?.name}
            </p>
          </div>
        </div>

        <Button
          className='text-secondary font-bold'
          color='primary'
          isLoading={isUpdating}
          startContent={!isUpdating && <SaveIcon size={18} />}
          onPress={handleSave}
        >
          บันทึกเนื้อหาภาษา {localization?.languageCode?.toUpperCase()}
        </Button>
      </div>

      <MdEditorCustomize
        key={loadCount}
        placeholder='เริ่มเขียนรายละเอียดสินค้าในภาษานี้...'
        value={content}
        onChange={(val) => setContent(val)}
      />
    </Container>
  )
}

export default ProductLocalizationDescriptionPage
