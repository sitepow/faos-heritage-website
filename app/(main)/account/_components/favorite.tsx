import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { useDisclosure } from '@heroui/modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBagIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import type { GetFavoriteResult } from '../actions/favorite'
import type { ComponentProps, FC } from 'react'

import { createCart } from '../../cart/actions/cart'
import { deleteFavorite } from '../actions/favorite'

import { ModalConfirm } from '@/components/modal/confirm'
import { Price } from '@/components/price'
import { createSlug, getProductUnit } from '@/utils/helper'
import { cn } from '@/utils/style'

type Props = ComponentProps<typeof Card> & {
  favorite: GetFavoriteResult
}

const Favorite: FC<Props> = ({ className, favorite, ...props }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    isOpen: isOpenDeleteFavorite,
    onOpenChange: onOpenDeleteFavoriteChange,
  } = useDisclosure()

  const { data: session } = useSession()
  const userId = session?.user?.id
  const productId = favorite?.product?.id

  const QUERY = {
    FAVORITES: ['account', 'favorites', userId],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
  }

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY.CART,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY.CART_COUNT,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY.FAVORITES,
      }),
    ])

    goTo.cart()
  }

  const goTo = {
    cart: () => router.push('/cart'),
  }

  const { mutate: mutateCreateCart, isPending: isPendingCreateCart } =
    useMutation({
      mutationFn: () => createCart({ userId: userId!, productId: productId! }),
      onSuccess: async () => {
        await deleteFavorite({ userId, productId })

        onRefetch()
      },
      onError: async () => {
        await deleteFavorite({ userId, productId })

        onRefetch()
      },
    })

  const { mutate: mutateDeleteFavorite, isPending: isPendingDeleteFavorite } =
    useMutation({
      mutationFn: () => deleteFavorite({ userId, productId }),
      onSuccess: async () => {
        onRefetch()
      },
    })

  return (
    <>
      <ModalConfirm
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
          '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
        )}
        radius='none'
        shadow='none'
        {...props}
      >
        <CardBody>
          <div className='flex flex-wrap justify-between gap-4'>
            <div className='flex flex-wrap gap-4 lg:max-w-1/2 lg:flex-nowrap'>
              <Link
                className='size-[150px] shrink-0 border border-divider'
                href={`/product/${createSlug(favorite?.product?.name, favorite?.product?.id)}`}
              >
                <Image
                  alt='product-image'
                  className='size-full'
                  height={100}
                  src={
                    favorite?.product?.images?.[0]?.url ?? '/placeholder.svg'
                  }
                  width={100}
                />
              </Link>

              <div className='flex flex-col'>
                <span>{favorite?.product?.name}</span>
                <span className='line-clamp-2 text-sm text-default-500'>
                  {favorite?.product?.shortDescription}
                </span>
                <span className='text-sm text-default-500'>
                  Product code : {favorite?.product?.id}
                </span>
                <Price
                  price={favorite?.product?.price}
                  priceMax={favorite?.priceMax!}
                  priceMin={favorite?.priceMin!}
                  unit={getProductUnit(favorite?.product?.unit)}
                />
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <Button
                isDisabled={isPendingCreateCart}
                isLoading={isPendingCreateCart}
                startContent={
                  !isPendingCreateCart && (
                    <ShoppingBagIcon className='text-default-500' />
                  )
                }
                variant='faded'
                onClick={async () => {
                  mutateCreateCart()
                }}
              >
                Add to cart
              </Button>
              <Button
                isDisabled={isPendingDeleteFavorite}
                isLoading={isPendingDeleteFavorite}
                startContent={
                  !isPendingDeleteFavorite && (
                    <TrashIcon className='text-default-500' />
                  )
                }
                variant='faded'
                onClick={onOpenDeleteFavoriteChange}
              >
                Remove from favorites
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export { Favorite }
