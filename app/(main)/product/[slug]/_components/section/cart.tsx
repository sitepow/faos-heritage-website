import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { CopyIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import { useProductStore } from '../../store'

import { createCart } from '@/app/(main)/cart/actions/cart'
import { Price } from '@/components/price'
import { Quantity } from '@/components/quantity'
import { cn } from '@/utils/style'
import { Alert } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const CartSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const user = session?.user

  const { product } = useProductStore()

  const { mutate: mutateCreateCart, isPending: isPendingCreateCart } = useMutation({
    mutationFn: () => createCart(user!.id, product!.id, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['carts', user?.id],
      })
    },
  })

  const onSumit = () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าเข้าตระกร้า')
      router.push('/login')

      return
    }

    mutateCreateCart()
  }

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className='flex flex-col items-start gap-4'>
        <Price price={product?.price!} />
        <Alert description={`ขณะนี้มีสินค้าในคลังพร้อมขายจำนวน ${product?.stockQuantity} ชิ้น`} />
        <div className='flex w-full items-center gap-4'>
          <Quantity maxValue={product?.stockQuantity} />
          <Button
            fullWidth
            isDisabled={isPendingCreateCart}
            isLoading={isPendingCreateCart}
            onClick={() => onSumit()}
            startContent={<ShoppingCartIcon className='text-default-500' />}
            variant='faded'
          >
            ใส่ตระกร้า
          </Button>
        </div>
      </CardHeader>

      <CardBody className='gap-4'>
        <div className='flex justify-center gap-4 border-y border-divider py-2.5'>
          <div className='flex cursor-pointer gap-2'>
            <HeartIcon className='text-default-500' />
            <span>รายการโปรด</span>
          </div>
          <div className='flex cursor-pointer gap-2'>
            <CopyIcon className='text-default-500' />
            <span>เปรียบเทียบ</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { CartSection }
