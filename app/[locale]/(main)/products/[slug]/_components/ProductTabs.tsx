'use client'

import { Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { ProductDescription } from './ProductDescription'
import { ProductReview } from './ProductReview'

const ProductTabs = () => {
  const translateProductDetail = useTranslations('productDetail')

  return (
    <Tabs className='mx-auto' variant='light'>
      <Tab title={translateProductDetail('tabs.description')}>
        <ProductDescription />
      </Tab>
      <Tab title={translateProductDetail('tabs.review')}>
        <ProductReview />
      </Tab>
    </Tabs>
  )
}

export { ProductTabs }
