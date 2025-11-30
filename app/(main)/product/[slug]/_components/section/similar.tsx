import { useQuery } from '@tanstack/react-query'

import { useProductStore } from '../../store'

import { getProducts } from '@/actions/product'
import { ProductSection } from '@/app/(main)/_components/section/product'

const ITEM_PER_PAGE = 8

const SimilarSection = () => {
  const { product } = useProductStore()
  const categoryId = product?.categoryId

  const { data, isLoading } = useQuery({
    queryKey: ['similarProducts', categoryId],
    queryFn: () => getProducts({ limit: ITEM_PER_PAGE, categoryId }),
    enabled: !!categoryId,
  })

  const similars = data?.items?.filter((similar) => similar.id !== product?.id) ?? []

  return (
    <div className='flex flex-col gap-4'>
      {similars?.length !== 0 && (
        <span className='mx-auto w-fit border-b border-primary-website pb-1 text-xl font-bold'>
          สินค้าใกล้เคียง/ทดแทน
        </span>
      )}

      <ProductSection isLoading={isLoading} itemPerPage={ITEM_PER_PAGE} items={similars} />
    </div>
  )
}

export { SimilarSection }
