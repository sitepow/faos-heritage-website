/* eslint-disable no-unused-vars */
'use client'

import { Avatar, Select, SelectItem } from '@heroui/react'
import { useTranslations } from 'next-intl'

import type { GetCartsResult } from '@/features/cart/cart.action'

type VariantData = NonNullable<
  NonNullable<GetCartsResult>[number]['product']
>['variants'][number]

interface VariantSelectProps {
  variants: VariantData[]
  selectedVariantId: string | null
  onChange: (id: string) => void
  isDisabled?: boolean
}

const VariantSelect = ({
  variants,
  selectedVariantId,
  onChange,
  isDisabled,
}: VariantSelectProps) => {
  const tForm = useTranslations('form')

  if (!variants?.length) {
    return null
  }

  return (
    <Select
      disallowEmptySelection
      isDisabled={isDisabled}
      placeholder={tForm('require')}
      radius='none'
      selectedKeys={selectedVariantId ? [selectedVariantId] : []}
      size='lg'
      variant='bordered'
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string
        onChange(selected)
      }}
    >
      {variants.map((v) => (
        <SelectItem
          key={v.id}
          startContent={
            <Avatar
              className='flex-shrink-0'
              size='sm'
              src={v.image ?? '/images/no-image.jpg'}
            />
          }
        >
          {v.name}
        </SelectItem>
      ))}
    </Select>
  )
}

export { VariantSelect }
