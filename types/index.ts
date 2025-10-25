import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface CategoryItem {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
}
