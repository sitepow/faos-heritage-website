'use client'

import { Card, useDisclosure, CardBody, Button } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import type { ComponentProps } from 'react'

import { deleteFavorite, type GetFavoriteResult } from './action'

import { ProductPrice } from '@/app/(main)/product'
import { ConfirmModal } from '@/components/modal/confirm'
import { NO_IMAGE } from '@/utils/constants'
import { getProductUnit } from '@/utils/features'
import { createSlug } from '@/utils/slug'
import { cn } from '@/utils/style'

type FavoriteItemProps = ComponentProps<typeof Card> & {
  favorite: GetFavoriteResult
}

export const FavoriteItem = ({
  className,
  favorite,
  ...props
}: FavoriteItemProps) => {
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

  return (
    <>
      <ConfirmModal
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
                className='border-divider size-[150px] shrink-0 border'
                href={`/product/${createSlug(favorite?.product?.name, favorite?.product?.id)}`}
              >
                <Image
                  alt='product-image'
                  className='aspect-square size-full object-cover'
                  height={100}
                  src={favorite?.product?.images?.[0]?.url ?? NO_IMAGE}
                  width={100}
                />
              </Link>

              <div className='flex flex-col'>
                <span>{favorite?.product?.name}</span>
                <span className='text-default-500 line-clamp-2 text-sm'>
                  {favorite?.product?.shortDescription}
                </span>
                <span className='text-default-500 text-sm'>
                  Product ID : {favorite?.product?.id}
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
                className='text-secondary'
                color='primary'
                isDisabled={isPendingDeleteFavorite}
                isLoading={isPendingDeleteFavorite}
                startContent={!isPendingDeleteFavorite && <XIcon />}
                onClick={onOpenDeleteFavoriteChange}
              >
                Remove Favorite
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
