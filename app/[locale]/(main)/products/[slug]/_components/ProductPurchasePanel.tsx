'use client'

import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Avatar,
  NumberInput,
} from '@heroui/react'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ProductPrice } from './ProductPrice'
import { ProductShare } from './ProductShare'

import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { ProductChip } from '@/components/ui/Product/ProductChip'
import { useProductPurchase } from '@/features/product/useProduct'
import { generateSlugWithId } from '@/utils'

const ProductPurchasePanel = () => {
  const translate = useTranslations('ProductCart')
  const { product, state, actions, loading } = useProductPurchase()

  if (!product) {
    return null
  }

  return (
    <Card className='border-divider border' radius='sm' shadow='none'>
      <CardBody className='flex flex-col gap-4'>
        <div>
          <h1 className='py-3 text-xl font-semibold sm:text-2xl lg:text-4xl'>
            {product.name}
          </h1>

          <ProductChip
            categoryName={product.category?.name}
            isAuthentic={product.isAuthentic}
            isPremiumProduct={product.isPremiumProduct}
          />

          <ProductPrice
            className='mt-5 items-start'
            price={state.price}
            priceMax={!state.selectedVariantId ? product.priceMax : null}
            priceMin={!state.selectedVariantId ? product.priceMin : null}
            unit={product.unit}
          />
        </div>

        {product.shortDescription && (
          <Card className='bg-default-50 dark:bg-default-100'>
            <CardBody>
              <MarkdownRenderer content={product.shortDescription} />
            </CardBody>
          </Card>
        )}

        {state.hasVariants && (
          <div className='flex flex-col gap-2 sm:flex-row'>
            <NumberInput
              isDisabled={state.isOutOfStock}
              label={translate('quantity')}
              maxValue={state.stock}
              minValue={1}
              value={state.quantity}
              variant='bordered'
              onValueChange={(v) =>
                typeof v === 'number' && actions.changeQuantity(v)
              }
            />

            <Select
              label={translate('productOptions')}
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

        <div className='flex gap-2'>
          <Button
            fullWidth
            isDisabled={state.hasFavorite}
            isLoading={loading.isAddingToFavorite}
            startContent={<HeartIcon />}
            variant='faded'
            onPress={() => actions.addToFavorite()}
          >
            <span className='hidden md:block'>
              {translate('addToFavorites')}
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
            isLoading={loading.isAddingToCart}
            startContent={<ShoppingCartIcon />}
            onPress={() => actions.addToCart()}
          >
            <span className='hidden md:block'>{translate('addToCart')}</span>
          </Button>
        </div>

        <ProductShare
          label={translate('share')}
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
