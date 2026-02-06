'use client'

import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Avatar,
} from '@heroui/react'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ProductShare } from './ProductShare'

import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { ProductChip } from '@/components/ui/Product/ProductChip'
import { ProductPrice } from '@/components/ui/Product/ProductPrice'
import { useProductPurchase } from '@/features/product/useProduct'
import { generateSlugWithId } from '@/utils'

const ProductPurchasePanel = () => {
  const translateActions = useTranslations('actions')
  const translateCartActions = useTranslations('productDetail.cartActions')

  const {
    product,
    state,
    actions,
    loading: { isAddingToCart, isAddingToFavorite },
  } = useProductPurchase()

  if (!product) {
    return null
  }

  return (
    <Card className='border-default-100 border' radius='sm' shadow='none'>
      <CardBody className='flex flex-col gap-4'>
        <div>
          <h1 className='py-3 text-xl font-semibold sm:text-2xl lg:text-4xl'>
            {product.name}
          </h1>

          <div>
            <ProductChip
              categoryName={product.category?.name}
              className='my-5 justify-start'
              isAuthentic={product.isAuthentic}
              isPremiumProduct={product.isPremiumProduct}
            />

            <ProductPrice
              className='items-start'
              price={state.price}
              priceMax={!state.selectedVariantId ? product.priceMax : null}
              priceMin={!state.selectedVariantId ? product.priceMin : null}
              unit={product.unit}
            />
          </div>
        </div>

        {state.hasVariants && (
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Select
              classNames={{
                trigger: 'shadow-none',
              }}
              label={translateCartActions('options')}
              radius='none'
              selectedKeys={
                state.selectedVariantId ? [state.selectedVariantId] : []
              }
              variant='bordered'
              onSelectionChange={(keys) =>
                actions.selectVariant(Array.from(keys)[0] as string)
              }
            >
              {(product.variants ?? []).map((variant) => (
                <SelectItem
                  key={variant.id}
                  startContent={
                    <Avatar src={variant.image ?? '/images/no-image.jpg'} />
                  }
                >
                  {variant.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}

        {product.shortDescription && (
          <MarkdownRenderer content={product.shortDescription} />
        )}

        <div className='flex gap-2'>
          <Button
            fullWidth
            className='bg-primary/20 border-primary text-primary border'
            isDisabled={state.hasFavorite}
            isLoading={isAddingToFavorite}
            radius='none'
            size='lg'
            startContent={!isAddingToFavorite && <HeartIcon />}
            variant='faded'
            onPress={() => actions.addToFavorite()}
          >
            <span className='hidden md:block'>
              {translateCartActions('fav')}
            </span>
          </Button>

          <Button
            fullWidth
            className='text-secondary'
            color='primary'
            isDisabled={
              state.isOutOfStock ||
              (state.hasVariants && !state.selectedVariantId)
            }
            isLoading={isAddingToCart}
            radius='none'
            size='lg'
            startContent={!isAddingToCart && <ShoppingCartIcon />}
            onPress={() => actions.addToCart()}
          >
            <span className='hidden md:block'>
              {translateCartActions('add')}
            </span>
          </Button>
        </div>

        <ProductShare
          label={translateActions('share')}
          title={product.name}
          url={`${process.env.NEXT_PUBLIC_APP_URL}/product/${generateSlugWithId(
            product.name,
            product.id,
          )}`}
        />
      </CardBody>
    </Card>
  )
}

export { ProductPurchasePanel }
