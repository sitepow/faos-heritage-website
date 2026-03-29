/* eslint-disable react/no-array-index-key */
'use client'

import type { FooterMenuSection } from '../Footer.types'

import { FooterGroup } from './FooterGroup'
import { FooterIcon } from './FooterIcon'

import { useActiveStorefronts } from '@/features/storefront/hook'

const FooterSection = ({ section }: { section: FooterMenuSection }) => {
  const { data: storefronts } = useActiveStorefronts()

  if (section.isGroup) {
    return (
      <div className='flex flex-col gap-10'>
        {section.subSections?.map((sub, idx) => {
          return <FooterGroup key={idx} {...sub} />
        })}
      </div>
    )
  }

  if (section.isPartner) {
    return (
      <nav className='flex flex-col gap-3'>
        <ul className='marker:text-primary list-disc pl-5'>
          {storefronts?.map((storefront) => {
            return (
              <li key={storefront.id} className='mb-2'>
                <a
                  className='hover:text-primary text-default-500 transition-all'
                  href={storefront.googleMapUrl || '#'}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {storefront.name}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  if (section.isMarketplace || section.isCertificate) {
    return (
      <div className='flex flex-wrap gap-3'>
        {section.items?.map((item, i) => {
          if (typeof item === 'object' && 'image' in item) {
            return (
              <a
                key={i}
                className={
                  item.href === '#'
                    ? 'cursor-default'
                    : 'transition-opacity hover:opacity-80'
                }
                href={item.href}
                rel='noopener noreferrer'
                target={item.href !== '#' ? '_blank' : undefined}
              >
                <FooterIcon
                  alt='partner'
                  hover={section.isMarketplace}
                  src={item.image!}
                />
              </a>
            )
          }

          if (typeof item === 'string') {
            return (
              <FooterIcon
                key={i}
                alt='certification'
                hover={section.isMarketplace}
                src={item}
              />
            )
          }

          return null
        })}

        {section.maps?.map((mapSrc, i) => {
          return (
            <div
              key={`map-${i}`}
              className='border-default-100 mt-2 h-24 w-full overflow-hidden rounded-lg border'
            >
              <iframe
                className='h-full w-full contrast-125 grayscale'
                loading='lazy'
                src={mapSrc}
                title='map'
              />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <nav className='flex flex-col gap-3'>
      <ul className='marker:text-primary list-disc pl-5'>
        {section.items?.map((link, i) => {
          return (
            typeof link === 'object' &&
            'label' in link && (
              <li key={i} className='mb-2'>
                <a
                  className='hover:text-primary text-default-500 transition-all'
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            )
          )
        })}
      </ul>
    </nav>
  )
}

export { FooterSection }
