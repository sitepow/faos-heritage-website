'use client'

import { Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { ProductDescription } from './ProductDescription'

const ProductTabs = () => {
  const tProductDetail = useTranslations('productDetail')

  return (
    <Tabs className='mx-auto' variant='bordered'>
      <Tab title={tProductDetail('tabs.description')}>
        <ProductDescription />
      </Tab>
    </Tabs>
  )
}

export { ProductTabs }
