'use client'

import { Card, useDisclosure, CardBody, Button } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { deleteFavorite, type GetFavoriteResult } from './action'
import { ProductPrice } from '../../../product/[slug]/_components/price'

import { ConfirmModal } from '@/components/confirm-modal'
import { getProductUnit } from '@/utils/helpers/product'
import { createSlug } from '@/utils/helpers/slug'
import { cn } from '@/utils/style'

type FavoriteItemProps = ComponentProps<typeof Card> & {
  favorite: GetFavoriteResult
}

export const FavoriteItem = ({
  className,
  favorite,
  ...props
}: FavoriteItemProps) => {
  const t = useTranslations('Account')
  const queryClient = useQueryClient()

  const {
    isOpen: isOpenDeleteFavorite,
    onOpenChange: onOpenDeleteFavoriteChange,
  } = useDisclosure()

  const { data: session } = useSession()
  const userId = session?.user?.id
  const productId = favorite?.product?.id

  const QUERY_KEY = {
    FAVORITES: ['account', 'favorites', userId],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
  }

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.CART,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.CART_COUNT,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.FAVORITES,
      }),
    ])
  }

  const { mutate: mutateDeleteFavorite, isPending: isPendingDeleteFavorite } =
    useMutation({
      mutationFn: () => deleteFavorite({ userId, productId }),
      onSuccess: async () => {
        onRefetch()
      },
    })

  const primaryImage =
    favorite?.product?.images?.find((img) => img.isPrimary) ??
    favorite?.product?.images?.[0]

  return (
    <>
      <ConfirmModal
        title={t('modals.removeFavorite.title')}
        description={t('modals.removeFavorite.description')}
        isOpen={isOpenDeleteFavorite}
        isPending={isPendingDeleteFavorite}
        onConfirm={() => {
          mutateDeleteFavorite()
        }}
        onOpenChange={onOpenDeleteFavoriteChange}
      />

      <Card
        fullWidth
        className={cn(
          className,
          '[&:not(:last-child)]:border-divider [&:not(:last-child)]:border-b',
        )}
        radius='none'
        shadow='none'
        {...props}
      >
        <CardBody>
          <div className='flex flex-wrap justify-between gap-4'>
            <div className='flex flex-wrap gap-4 lg:max-w-1/2 lg:flex-nowrap'>
              <Link
                className='border-divider size-[150px] shrink-0 rounded-xl border'
                href={`/product/${createSlug(favorite?.product?.name, favorite?.product?.id)}`}
              >
                <Image
                  alt='product-image'
                  className='aspect-square size-full rounded-xl bg-white object-contain'
                  height={150}
                  src={primaryImage?.url ?? '/images/no-image.jpg'}
                  width={150}
                />
              </Link>

              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{favorite?.product?.name}</span>
                <span className='text-default-500 line-clamp-2 text-sm'>
                  {favorite?.product?.shortDescription}
                </span>
                <span className='text-default-500 text-sm'>
                  {t('fields.productId')} : {favorite?.product?.id}
                </span>
                <ProductPrice
                  price={favorite?.product?.price}
                  priceMax={favorite?.priceMax!}
                  priceMin={favorite?.priceMin!}
                  unit={getProductUnit(favorite?.product?.unit)}
                />
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <Button
                color='primary'
                variant='bordered'
                isDisabled={isPendingDeleteFavorite}
                isLoading={isPendingDeleteFavorite}
                startContent={!isPendingDeleteFavorite && <XIcon size={18} />}
                onClick={onOpenDeleteFavoriteChange}
              >
                {t('buttons.removeFavorite')}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
