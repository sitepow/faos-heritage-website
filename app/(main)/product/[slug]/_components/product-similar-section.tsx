import { ProductSection } from '@/app/(main)/_components/product/product-section'
import { PRODUCT_CONSTANT } from '@/utils/const'

const ProductSimilarSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <span className='text-xl font-bold'>สินค้าใกล้เคียง/ทดแทน</span>
      <ProductSection items={PRODUCT_CONSTANT?.slice(0, 8)} />
    </div>
  )
}

export { ProductSimilarSection }
