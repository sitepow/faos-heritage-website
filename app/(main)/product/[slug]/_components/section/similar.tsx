import { ProductSection } from '@/app/(main)/_components/section/product'

const SimilarSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <span className='mx-auto w-fit border-b border-primary-website pb-1 text-xl font-bold'>
        สินค้าใกล้เคียง/ทดแทน
      </span>
      <ProductSection items={[]} />
    </div>
  )
}

export { SimilarSection }
