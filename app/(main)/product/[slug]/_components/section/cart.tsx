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
import { ACCOUNT_TAB } from '@/utils/const'
import { getProductUnit } from '@/utils/helper'
import { cn } from '@/utils/style'

const CartSection: FC<
  ComponentProps<typeof Card> & {
    product?: GetProductResult
  }
> = ({ className, product, ...props }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [variantId, setVariantId] = useState<string | null>(null)

  const { data: session } = useSession()
  const userId = session?.user?.id

  const init = {
    variants: product?.variants,
    wishlist: product?.wishlist,
    cart: product?.cart,
    defaultVariantId: product?.cart?.[0]?.variantId,
    price: product?.price,
    stockQuantity: product?.stockQuantity,
  }
  const hasVariants = Boolean(init?.variants?.length)
  const hasFavorite = Boolean(init?.wishlist?.length)

  useEffect(() => {
    const variantId = init?.defaultVariantId

    if (variantId) setVariantId(variantId)
  }, [init?.cart])

  useEffect(() => {
    if (!hasVariants || variantId) return

    const variant = init?.variants?.[0]?.id

    if (variant) setVariantId(variant)
  }, [hasVariants, init?.variants, variantId])

  const currentVariant = useMemo(() => {
    return init?.variants?.find((variant) => variant.id === variantId)
  }, [init?.variants, variantId])

  const currentPrice = currentVariant?.price ?? init?.price
  const currentStockQuantity =
    currentVariant?.stockQuantity ?? init?.stockQuantity ?? 0

  const isOutOfStock = currentStockQuantity <= 0
  const priceMin = variantId ? null : product?.priceMin
  const priceMax = variantId ? null : product?.priceMax

  const QUERY = {
    PRODUCT: ['product', product?.id],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
    FAVORITE: ['account', 'favorites', userId],
    FAVORITE_COUNT: ['favorites', 'count', userId],
  }

  const GOTO = {
    CART: () => router.push('/cart'),
    LOGIN: () => router.push('/login'),
    FAVORITE: () => router.push(`/account?tab=${ACCOUNT_TAB.FAVORITE}`),
  }

  const requireAuthAndProduct = (actionName: string): boolean => {
    if (!userId) {
      toast.error(`กรุณาเข้าสู่ระบบก่อน${actionName}`)
      GOTO.LOGIN()

      return false
    }
    if (!product?.id) {
      toast.error('ไม่พบข้อมูลสินค้า')

      return false
    }

    return true
  }

  const { mutate: mutateCreateCart, isPending: isPendingCreateCart } =
    useMutation({
      mutationFn: () => {
        if (!product || !userId) throw new Error('ข้อมูลไม่ครบ')

        return createCart({
          userId,
          productId: product.id,
          variantId: variantId!,
        })
      },
      onSettled: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY.CART }),
          queryClient.invalidateQueries({ queryKey: QUERY.CART_COUNT }),
          queryClient.invalidateQueries({ queryKey: QUERY.PRODUCT }),
        ])
        GOTO.CART()
      },
    })

  const { mutate: mutateCreateFavorite, isPending: isPendingCreateFavorite } =
    useMutation({
      mutationFn: () => {
        if (!product || !userId) throw new Error('ข้อมูลไม่ครบ')

        return createFavorite(userId, product.id)
      },
      onSettled: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY.FAVORITE }),
          queryClient.invalidateQueries({ queryKey: QUERY.FAVORITE_COUNT }),
        ])
        GOTO.FAVORITE()
      },
    })

  const onSubmitCart = () => {
    if (!requireAuthAndProduct('เพิ่มสินค้าเข้าตระกร้า')) return
    if (isOutOfStock) return toast.error('สินค้าหมดสต็อก')
    mutateCreateCart()
  }

  const onSubmitFavorite = () => {
    if (!requireAuthAndProduct('เพิ่มสินค้าเข้ารายการโปรด')) return
    mutateCreateFavorite()
  }

  const productUnit = getProductUnit(product?.unit!)

  return (
    <Card className={cn(className, 'h-fit')} {...props}>
      <CardHeader className='flex flex-col items-start gap-4'>
        {currentPrice && (
          <Price
            price={currentPrice}
            priceMax={priceMax!}
            priceMin={priceMin!}
            unit={productUnit}
          />
        )}
      </CardHeader>

      <CardBody className='flex-wrap gap-4'>
        <Alert
          className='text-start'
          description={
            isOutOfStock
              ? 'สินค้านี้หมดชั่วคราว โปรดดูสินค้าใกล้เคียง/ทดแทน'
              : `สินค้าพร้อมจำหน่าย มีจำนวน ${currentStockQuantity} ${productUnit} ในสต็อก`
          }
          variant='bordered'
        />

        {hasVariants && (
          <Select
            disallowEmptySelection
            fullWidth
            items={product!.variants!}
            label='ตัวเลือกสินค้า'
            placeholder='เลือกตัวเลือกสินค้า'
            selectedKeys={variantId ? [variantId] : []}
            variant='bordered'
            onSelectionChange={(keys) =>
              setVariantId(Array.from(keys)[0] as string)
            }
          >
            {(v) => <SelectItem key={v.id}>{v.name}</SelectItem>}
          </Select>
        )}

        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button
            fullWidth
            isDisabled={isPendingCreateFavorite || hasFavorite}
            isLoading={isPendingCreateFavorite}
            startContent={
              !isPendingCreateFavorite && (
                <HeartIcon className='text-default-500' />
              )
            }
            variant='faded'
            onClick={onSubmitFavorite}
          >
            {hasFavorite ? 'อยู่ในรายการโปรดแล้ว' : 'เพิ่มในรายการโปรด'}
          </Button>

          <Button
            fullWidth
            isDisabled={
              isPendingCreateCart || isOutOfStock || (hasVariants && !variantId)
            }
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
