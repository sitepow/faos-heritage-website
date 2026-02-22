'use client'

import { Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { ProductDescription } from './ProductDescription'
import { ProductReview } from './ProductReview'

const ProductTabs = () => {
  const tProductDetail = useTranslations('productDetail')

  return (
    <Tabs className='mx-auto' variant='bordered'>
      <Tab title={tProductDetail('tabs.description')}>
        <ProductDescription />
      </Tab>
      <Tab title={tProductDetail('tabs.review')}>
        <ProductReview />
      </Tab>
    </Tabs>
  )
}

export { ProductTabs }
