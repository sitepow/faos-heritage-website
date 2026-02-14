'use client'

import { Card, useDisclosure, CardBody, Button, Image } from '@heroui/react'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { ProductPrice } from '@/components/ui/Product/ProductPrice'
import { IMAGE_FALLBACK } from '@/constants'
import { type FavoriteListItem } from '@/features/favorite/favorite.action'
import { useFavoriteMutation } from '@/features/favorite/favorite.mutation'
import { resolveProductUnitLabel } from '@/utils'

type Props = ComponentProps<typeof Card> & {
  favorite: FavoriteListItem
}

const FavoriteItem = ({ favorite, ...props }: Props) => {
  const tActions = useTranslations('actions')

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { removeFromFav, isRemoving } = useFavoriteMutation()

  const { product, priceMin, priceMax } = favorite
  const primaryImage = product?.images?.[0]?.url ?? IMAGE_FALLBACK.EMPTY

  const handleRemove = async () => {
    if (!product?.id) {
      return
    }
    await removeFromFav(product.id)
    onOpenChange()
  }

  return (
    <>
      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isRemoving}
        onConfirm={handleRemove}
        onOpenChange={onOpenChange}
      />

      <Card fullWidth radius='none' shadow='none' {...props}>
        <CardBody>
          <div className='flex flex-wrap justify-between gap-4'>
            <div className='flex flex-wrap items-center gap-10 lg:max-w-1/2 lg:flex-nowrap'>
              <div className='border-default-100 relative aspect-square size-[250px] shrink-0 overflow-hidden rounded-lg border bg-white'>
                <Image
                  alt={product?.name ?? 'product'}
                  className='size-full object-contain p-10'
                  classNames={{ wrapper: 'size-full' }}
                  radius='none'
                  src={primaryImage}
                  width='100%'
                />
              </div>

              <div className='flex flex-col gap-1 sm:w-1/2'>
                <span className='font-semibold'>{product?.name}</span>
                <span className='text-default-500 line-clamp-2 text-sm'>
                  {product?.summary}
                </span>
                <ProductPrice
                  className='items-start'
                  price={product?.price!}
                  priceMax={priceMax}
                  priceMin={priceMin}
                  unit={resolveProductUnitLabel(product?.unit!)}
                />
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <Button
                color='primary'
                isDisabled={isRemoving}
                isLoading={isRemoving}
                startContent={!isRemoving && <XIcon />}
                variant='bordered'
                onPress={onOpen}
              >
                {tActions('delete')}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export { FavoriteItem }
