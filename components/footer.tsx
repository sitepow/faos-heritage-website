/* eslint-disable @next/next/no-img-element */
'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
import { SHIPPING_PROVIDERS } from '@/utils/constants/shipping'
import { cn } from '@/utils/style'

const FOOTER_SECTIONS = [
  {
    title: 'เกี่ยวกับ FAOS',
    items: [
      { label: 'เกี่ยวกับเรา', href: '/about' },
      { label: 'นโยบายความเป็นส่วนตัวของ FAOS', href: '/privacy' },
      { label: 'คำถามที่พบบ่อย', href: '#' },
      { label: 'ช่วยเหลือ?', href: '#' },
    ],
  },
  {
    isGroup: true,
    subSections: [
      {
        title: 'บริการจัดส่ง',
        isShipping: true,
      },
      {
        title: 'วิธีการชำระเงิน',
        isPayment: true,
        items: ['/images/visa-mastercard.png', '/images/promt-pay.jpg'],
      },
    ],
  },
  {
    title: 'จุดจำหน่ายสินค้า',
    isMarketplace: true,
    items: [
      '/images/market/food-land.png',
      '/images/market/villa-market.png',
      '/images/market/lazada.svg',
      '/images/market/shopee.png',
    ],
    maps: [
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.367656854077!2d100.5608179!3d13.732689800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f1d78e70295%3A0x65672fcbcdb9c20d!2z4Lif4Li54LmJ4LiU4LmB4Lil4LiZ4LiU4LmM!5e1!3m2!1sth!2sth!4v1768955985416!5m2!1sth!2sth',
    ],
  },
  {
    title: 'มาตรฐานและการรับรอง',
    isCertificate: true,
    items: [
      '/images/certificate/gmo-free.png',
      '/images/certificate/iso.png',
      '/images/certificate/bio.png',
      '/images/certificate/Chema_logo_medium.png',
    ],
  },
  {
    title: 'ติดตามเรา',
    items: [
      { label: 'Facebook', href: '#' },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/faos.asia',
      },
      { label: 'Line', href: '#' },
      { label: 'Lazada', href: '#' },
      { label: 'Shopee', href: '#' },
    ],
  },
]

type FooterProps = ComponentProps<'footer'>

export const Footer = ({ className, ...props }: FooterProps) => {
  const tFooter = useTranslations('Footer')
  const tSite = useTranslations('Site')
  const tCountry = useTranslations('Country')
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'border-primary flex w-full flex-col items-center justify-between gap-2 border-t-4 bg-white px-5 py-2.5 dark:bg-neutral-950',
        className,
      )}
      {...props}
    >
      <div className='border-divider container mx-auto grid justify-start gap-10 border-b py-10 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {FOOTER_SECTIONS.map((section, idx) => (
          <div key={idx} className='flex flex-col gap-4'>
            {!section.isGroup && (
              <span className='font-bold tracking-wider text-gray-900 uppercase dark:text-gray-100'>
                {section.title}
              </span>
            )}

            {section.isGroup && (
              <div className='flex flex-col gap-8'>
                {section.subSections?.map((sub, sIdx) => (
                  <div key={sIdx} className='flex flex-col gap-2'>
                    <span className='font-bold tracking-wider uppercase'>
                      {sub.title}
                    </span>
                    <div className='flex flex-wrap gap-2'>
                      {sub.isShipping &&
                        SHIPPING_PROVIDERS.map((shipping, i) => (
                          <img
                            key={i}
                            src={shipping?.image}
                            alt='shipping'
                            className='border-divider size-12 cursor-pointer rounded border object-cover sm:size-14'
                          />
                        ))}
                      {sub.isPayment &&
                        sub.items?.map((img, i) => (
                          <img
                            key={i}
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
                {section.items?.map((imgSrc, imgIdx) => (
                  <div
                    key={imgIdx}
                    className='border-divider flex items-center justify-center rounded-md border bg-white p-2'
                  >
                    <img
                      src={imgSrc}
                      alt='partner'
                      className={cn(
                        'h-8 w-auto cursor-pointer object-contain transition-all duration-300',
                        section.isMarketplace,
                      )}
                    />
                  </div>
                ))}
              </div>
            )}

            {section.maps?.map((mapSrc, mIdx) => (
              <div
                key={mIdx}
                className='border-divider overflow-hidden rounded-lg border'
              >
                <iframe
                  title={`map-${mIdx}`}
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
                    if (typeof link === 'object' && 'href' in link) {
                      return (
                        <a
                          key={lIdx}
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
            . All Rights Reserved
          </span>
        </div>

        <div className='flex flex-wrap items-center gap-1'>
          <span className='mr-1 font-medium'>Country & Region:</span>
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
