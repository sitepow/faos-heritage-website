/* eslint-disable @next/next/no-img-element */
'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
import { cn } from '@/utils/style'

type FooterProps = ComponentProps<'footer'>

export const Footer = ({ className, ...props }: FooterProps) => {
  const tFooter = useTranslations('Footer')
  const tSite = useTranslations('Site')
  const year = new Date().getFullYear()
  const tCountry = useTranslations('Country')

  return (
    <footer
      className={cn(
        'border-primary flex w-full flex-col items-center justify-between gap-2 border-t-4 bg-[#ffffff] px-5 py-2.5 dark:bg-inherit',
        className,
      )}
      {...props}
    >
      <div className='border-divider container mx-auto grid justify-center gap-5 border-b py-2.5 text-sm sm:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col gap-2'>
          <span className='font-bold'>เกี่ยวกับ FAOS</span>
          <span>เกี่ยวกับเรา</span>
          <span>นโยบายความเป็นส่วนตัวของ FAOS</span>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='font-bold'>บริการจัดส่ง</span>

          <div className='flex flex-wrap gap-1'>
            {SHIPPING_PROVIDERS.map((shipping) => (
              <img
                src={shipping?.image}
                className='border-divider size-20 rounded-lg border object-cover p-2'
              />
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='font-bold'>ติดตามเรา</span>
          <span>Facebook</span>
          <span>Instagram</span>
          <span>Line</span>
          <span>Lazada</span>
          <span>Shopee</span>
        </div>
      </div>

      <div className='container mx-auto flex flex-wrap justify-between gap-2 py-2.5 text-sm'>
        <span>
          {tFooter('copyright', {
            year,
            name: tSite('name'),
          })}
          . All Rights Reserved
        </span>

        <div className='flex flex-wrap gap-1'>
          <span>Country & Region: </span>

          {CURRENCY_LOCALE_MAP.map((item) => (
            <span
              key={item.country}
              className='border-divider border-r pr-2.5 last:border-r-0 last:pr-0'
            >
              {tCountry(item.country)}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
