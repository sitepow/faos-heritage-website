import type { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export interface CategoryCard {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  price: number
  image?: string
  stock: number
  unit?: string
}

export interface ArticleCard {
  id: string
  name: string
  description: string
  image?: string
}
