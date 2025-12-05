'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
import { createFavorite } from '@/app/(main)/account/actions/favorite'
import { createCart } from '@/app/(main)/cart/actions/cart'
import { Price } from '@/components/price'
import { cn } from '@/utils/style'
import { Alert } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const CartSection: FC<
  ComponentProps<typeof Card> & {
    product?: GetProductResult
  }
> = ({ className, product, ...props }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const CART_COUT_QUERY_KEY = ['carts', 'count', userId]
  const FAVORITE_QUERY_KEY = ['account', 'favorites', userId]
  const FAVORITE_COUNT_QUERY_KEY = ['favorites', 'count', userId]

  const { mutate: mutateCreateCart, isPending: isPendingCreateCart } = useMutation({
    mutationFn: () => createCart(userId!, product!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CART_COUT_QUERY_KEY,
      })

      toast.success('เพิ่มสินค้าเข้าตระกร้าเรียบร้อยแล้ว')
    },
  })

  const { mutate: mutateCreateFavorite, isPending: isPendingCreateFavorite } = useMutation({
    mutationFn: () => createFavorite(userId!, product!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAVORITE_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: FAVORITE_COUNT_QUERY_KEY,
      })

      toast.success('เพิ่มสินค้าเข้ารายการโปรดเรียบร้อยแล้ว')
    },
  })

  const onSumitCart = () => {
    if (!userId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าเข้าตระกร้า')
      router.push('/login')

      return
    }

    mutateCreateCart()
  }

  const onSumitFavorite = () => {
    if (!userId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าเข้ารายการโปรด')
      router.push('/login')

      return
    }

    mutateCreateFavorite()
  }

  return (
    <Card className={cn(className, 'h-fit')} {...props}>
      <CardHeader className='flex flex-col items-start gap-4'>
        <Price price={product?.price!} />
        <Alert
          className='text-start'
          description={`สินค้าพร้อมจำหน่าย มีจำนวนเพียง ${product?.stockQuantity} ชิ้นในสต็อก`}
        />
      </CardHeader>

      <CardBody className='flex flex-col justify-center gap-2 sm:flex-row'>
        <Button
          fullWidth
          isDisabled={isPendingCreateFavorite}
          isLoading={isPendingCreateFavorite}
          onClick={() => onSumitFavorite()}
          startContent={!isPendingCreateFavorite && <HeartIcon className='text-default-500' />}
          variant='faded'
        >
          เพิ่มในรายการโปรด
        </Button>

        <Button
          fullWidth
          isDisabled={isPendingCreateCart}
          isLoading={isPendingCreateCart}
          onClick={() => onSumitCart()}
          startContent={!isPendingCreateCart && <ShoppingCartIcon className='text-default-500' />}
          variant='faded'
        >
          หยิบใส่ตระกร้า
        </Button>
      </CardBody>
    </Card>
  )
}

export { CartSection }
