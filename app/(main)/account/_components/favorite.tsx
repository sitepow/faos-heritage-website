import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { useDisclosure } from '@heroui/modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBagIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import type { FavoriteItem } from '../actions/favorite'
import type { ComponentProps, FC } from 'react'

import { createCart } from '../../cart/actions/cart'
import { deleteFavorite } from '../actions/favorite'

import { ModalDelete } from '@/components/modal/delete'
import { Price } from '@/components/price'
import { createSlug } from '@/utils/helper'
import { cn } from '@/utils/style'

type Props = ComponentProps<typeof Card> & {
  favorite: FavoriteItem
}

const Favorite: FC<Props> = ({ className, favorite, ...props }) => {
  const queryClient = useQueryClient()
  const {
    isOpen: isOpenDeleteFavorite,
    onOpenChange: onOpenDeleteFavoriteChange,
  } = useDisclosure()

  const { data: session } = useSession()
  const userId = session?.user?.id
  const productId = favorite?.product?.id

  const FAVORITE_QUERY_KEY = ['account', 'favorites', userId]
  const CART_COUNT_QUERY_KEY = ['carts', 'count', userId]
  const FAVORITE_COUNT_QUERY_KEY = ['favorites', 'count', userId]

  const onRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: CART_COUNT_QUERY_KEY,
    })
    queryClient.invalidateQueries({
      queryKey: FAVORITE_QUERY_KEY,
    })
    queryClient.invalidateQueries({
      queryKey: FAVORITE_COUNT_QUERY_KEY,
    })
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
      <ModalDelete
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
                className='shrink-0'
                href={`/product/${createSlug(favorite?.product?.name, favorite?.product?.id)}`}
              >
                <Image
                  alt='product-image'
                  className='size-32 rounded-xl'
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
                  รหัสสินค้า : {favorite?.product?.id}
                </span>
                <Price price={favorite?.product?.price} />
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
                เพิ่มเข้าตระกร้า
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
                ลบรายการโปรด
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export { Favorite }
