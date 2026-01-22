/* eslint-disable @next/next/no-img-element */
'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
import { cn } from '@/utils/style'

interface FooterLink {
  label: string
  href: string
}

interface FooterSubSection {
  title: string
  isShipping?: boolean
  isPayment?: boolean
  items?: string[]
}

interface FooterMenuSection {
  title?: string
  isGroup?: boolean
  isMarketplace?: boolean
  isCertificate?: boolean
  subSections?: FooterSubSection[]
  items?: (string | FooterLink)[]
  maps?: string[]
}

type FooterProps = ComponentProps<'footer'>

export const Footer = ({ className, ...props }: FooterProps) => {
  const tFooter = useTranslations('Footer')
  const tSite = useTranslations('Site')
  const tCountry = useTranslations('Country')
  const year = new Date().getFullYear()

  const menuData = tFooter.raw('Menu') as FooterMenuSection[]

  return (
    <footer
      className={cn(
        'border-primary flex w-full flex-col items-center justify-between gap-2 border-t-4 bg-white px-5 py-2.5 dark:bg-neutral-950',
        className,
      )}
      {...props}
    >
      <div className='border-divider container mx-auto grid justify-start gap-10 border-b py-10 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {menuData.map((section, idx) => (
          <div key={`section-${idx}`} className='flex flex-col gap-4'>
            {!section.isGroup && section.title && (
              <span className='font-bold tracking-wider text-gray-900 uppercase dark:text-gray-100'>
                {section.title}
              </span>
            )}

            {section.isGroup && (
              <div className='flex flex-col gap-8'>
                {section.subSections?.map((sub, sIdx) => (
                  <div
                    key={`sub-${idx}-${sIdx}`}
                    className='flex flex-col gap-2'
                  >
                    <span className='font-bold tracking-wider uppercase'>
                      {sub.title}
                    </span>
                    <div className='flex flex-wrap gap-2'>
                      {sub.isShipping &&
                        SHIPPING_PROVIDERS.map((shipping, i) => (
                          <img
                            key={`ship-${idx}-${i}`}
                            src={shipping?.image}
                            alt='shipping'
                            className='border-divider size-12 cursor-pointer rounded border object-cover sm:size-14'
                          />
                        ))}
                      {sub.isPayment &&
                        sub.items?.map((img, i) => (
                          <img
                            key={`pay-${idx}-${i}`}
                            src={img}
                            alt='payment'
                            className='h-10 w-auto cursor-pointer rounded-lg object-contain sm:h-12'
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(section.isMarketplace || section.isCertificate) && (
              <div className='mt-1 grid grid-cols-2 gap-2'>
                {section.items?.map((item, imgIdx) => {
                  if (typeof item !== 'string') return null
                  return (
                    <div
                      key={`img-${idx}-${imgIdx}`}
                      className='border-divider flex items-center justify-center rounded-md border bg-white p-2'
                    >
                      <img
                        src={item}
                        alt='partner'
                        className={cn(
                          'h-8 w-auto cursor-pointer object-contain transition-all duration-300',
                          section.isMarketplace && 'hover:scale-105',
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {section.maps?.map((mapSrc, mIdx) => (
              <div
                key={`map-${idx}-${mIdx}`}
                className='border-divider overflow-hidden rounded-lg border'
              >
                <iframe
                  title={`map-${idx}-${mIdx}`}
                  src={mapSrc}
                  className='h-32 w-full border-0'
                  loading='lazy'
                />
              </div>
            ))}

            {!section.isGroup &&
              !section.isMarketplace &&
              !section.isCertificate && (
                <nav className='flex flex-col gap-2'>
                  {section.items?.map((link, lIdx) => {
                    if (
                      typeof link === 'object' &&
                      link !== null &&
                      'href' in link
                    ) {
                      return (
                        <a
                          key={`link-${idx}-${lIdx}`}
                          href={link.href}
                          className='hover:text-primary transition-colors'
                        >
                          {link.label}
                        </a>
                      )
                    }
                    return null
                  })}
                </nav>
              )}
          </div>
        ))}
      </div>

      <div className='container mx-auto flex flex-wrap justify-between gap-4 py-6 text-[13px] text-gray-500'>
        <div className='flex items-center gap-1 font-medium'>
          <span>
            {tFooter('copyright', {
              year,
              name: tSite('name'),
            })}
          </span>
        </div>

        <div className='flex flex-wrap items-center gap-1'>
          <span className='mr-1 font-medium'>{tFooter('country')}</span>
          {CURRENCY_LOCALE_MAP.map((item) => (
            <button
              key={item.country}
              className='hover:text-primary border-divider cursor-pointer border-r px-2 transition-colors last:border-0 last:pr-0'
            >
              {tCountry(item.country)}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}
