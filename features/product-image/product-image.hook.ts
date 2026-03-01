'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getProductImages,
  getProductImage,
  getProductImageStat,
} from './product-image.action'
import { productImageQueryKeys } from './product-image.query-key'

const useProductImages = (productId: string) => {
  return useQuery({
    queryKey: productImageQueryKeys.lists.byProductId(productId),
    queryFn: () => getProductImages(productId),
    enabled: !!productId,
  })
}

const useProductImageDetail = (imageId: string | null) => {
  return useQuery({
    queryKey: productImageQueryKeys.details.byId(imageId || ''),
    queryFn: () => getProductImage(imageId || ''),
    enabled: !!imageId,
  })
}

const useProductImageStat = (productId: string) => {
  return useQuery({
    queryKey: productImageQueryKeys.stats(productId),
    queryFn: () => getProductImageStat(productId),
    enabled: !!productId,
  })
}

export { useProductImages, useProductImageDetail, useProductImageStat }
