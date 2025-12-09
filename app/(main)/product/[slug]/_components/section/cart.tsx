'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Alert, Select, SelectItem } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
} from 'react'
import { toast } from 'react-toastify'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'

import { createFavorite } from '@/app/(main)/account/actions/favorite'
import { createCart } from '@/app/(main)/cart/actions/cart'
import { Price } from '@/components/price'
import { ACCOUNT_TABS } from '@/utils/const'
import { cn } from '@/utils/style'

const CartSection: FC<
  ComponentProps<typeof Card> & {
    product?: GetProductResult
  }
> = ({ className, product, ...props }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (product?.cart?.[0]?.variantId) {
      setSelectedVariantId(product.cart[0].variantId)
    }
  }, [product?.cart])

  const userId = session?.user?.id
  const hasVariants = product?.variants && product.variants.length > 0
  const isFavorite = product?.wishlist?.length !== 0

  const currentVariant = useMemo(() => {
    if (!selectedVariantId || !product?.variants) return undefined

    return product.variants.find((variant) => variant.id === selectedVariantId)
  }, [product?.variants, selectedVariantId])

  const price = currentVariant?.price ?? product?.price
  const stockQuantity = currentVariant?.stockQuantity ?? product?.stockQuantity

  const isOutOfStock = (stockQuantity ?? 0) <= 0

  const CART_QUERY_KEY = ['carts', userId]
  const CART_COUT_QUERY_KEY = ['carts', 'count', userId]
  const FAVORITE_QUERY_KEY = ['account', 'favorites', userId]
  const FAVORITE_COUNT_QUERY_KEY = ['favorites', 'count', userId]

  const goToCart = () => router.push('/cart')
  const goToFavorite = () =>
    router.push(`/account?tab=${ACCOUNT_TABS?.FAVORITE}`)
  const goToLogin = () => router.push('/login')

  const { mutate: mutateCreateCart, isPending: isPendingCreateCart } =
    useMutation({
      mutationFn: () => {
        if (!product || !userId)
          throw new Error('โปรดระบุรหัสสินค้าหรือรหัสผู้ใช้งาน!')

        return createCart({
          userId: userId,
          productId: product.id,
          variantId: selectedVariantId!,
        })
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: CART_COUT_QUERY_KEY }),
        ])
        goToCart()
      },
      onError: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: CART_COUT_QUERY_KEY }),
        ])
        goToCart()
      },
    })

  const { mutate: mutateCreateFavorite, isPending: isPendingCreateFavorite } =
    useMutation({
      mutationFn: () => {
        if (!product || !userId)
          throw new Error('โปรดระบุรหัสสินค้าหรือรหัสผู้ใช้งาน!')

        return createFavorite(userId, product.id)
      },
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: FAVORITE_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: FAVORITE_COUNT_QUERY_KEY }),
        ])
        goToFavorite()
      },
      onError: () => {
        goToFavorite()
      },
    })

  const onSubmitCart = () => {
    if (!userId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าเข้าตระกร้า')
      goToLogin()

      return
    }

    if (!product || !product.id) {
      toast.error('ไม่พบข้อมูลสินค้า')

      return
    }

    if (isOutOfStock) {
      toast.error('สินค้าหมดสต็อก')

      return
    }

    mutateCreateCart()
  }

  const onSubmitFavorite = () => {
    if (!userId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าเข้ารายการโปรด')
      goToLogin()

      return
    }

    if (!product || !product.id) {
      toast.error('ไม่พบข้อมูลสินค้า')

      return
    }

    mutateCreateFavorite()
  }

  return (
    <Card className={cn(className, 'h-fit')} {...props}>
      <CardHeader className='flex flex-col items-start gap-4'>
        {price && <Price price={price} />}
      </CardHeader>

      <CardBody className='flex-wrap gap-4'>
        <Alert
          className='text-start'
          description={
            stockQuantity === 0
              ? `สินค้านี้หมดชั่วคราว โปรดดูสินค้าใกล้เคียง/ทดแทน`
              : `สินค้าพร้อมจำหน่าย มีจำนวนเพียง ${stockQuantity ?? 0} ชิ้นในสต็อก`
          }
          variant='bordered'
        />

        {hasVariants && (
          <Select
            fullWidth
            items={product.variants!}
            label='ตัวเลือกสินค้า'
            placeholder='เลือกตัวเลือกสินค้า'
            selectedKeys={selectedVariantId ? [selectedVariantId] : []}
            variant='faded'
            onSelectionChange={(keys) =>
              setSelectedVariantId(Array.from(keys)[0] as string)
            }
          >
            {(variant) => (
              <SelectItem key={variant.id}>{variant.name}</SelectItem>
            )}
          </Select>
        )}

        <div className='flex flex-col gap-4 sm:flex-row'>
          <Button
            fullWidth
            isDisabled={isPendingCreateFavorite || isFavorite}
            isLoading={isPendingCreateFavorite}
            startContent={
              !isPendingCreateFavorite && (
                <HeartIcon className='text-default-500' />
              )
            }
            variant='faded'
            onClick={onSubmitFavorite}
          >
            {isFavorite ? 'อยู่ในรายการโปรดนี้แล้ว' : 'เพิ่มในรายการโปรด'}
          </Button>

          <Button
            fullWidth
            isDisabled={isPendingCreateCart || isOutOfStock}
            isLoading={isPendingCreateCart}
            startContent={
              !isPendingCreateCart && (
                <ShoppingCartIcon className='text-default-500' />
              )
            }
            variant='faded'
            onClick={onSubmitCart}
          >
            หยิบใส่ตระกร้า
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export { CartSection }
