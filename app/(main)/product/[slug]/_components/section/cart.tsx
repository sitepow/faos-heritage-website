'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
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

  const { mutate: mutateCreateCart, isPending: isPendingCreateCart } = useMutation({
    mutationFn: () => createCart(userId!, product!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['carts', 'count', userId],
      })
    },
  })

  const onSumit = () => {
    if (!userId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าเข้าตระกร้า')
      router.push('/login')

      return
    }

    mutateCreateCart()
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
        <Button fullWidth startContent={<HeartIcon className='text-default-500' />} variant='faded'>
          เพิ่มในรายการโปรด
        </Button>

        <Button
          fullWidth
          isDisabled={isPendingCreateCart}
          isLoading={isPendingCreateCart}
          onClick={() => onSumit()}
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
