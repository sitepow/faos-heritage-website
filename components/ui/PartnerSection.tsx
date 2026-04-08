/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from 'react'

import { SectionHeader } from './SectionHeader'

import { IMAGE_FALLBACK } from '@/constants'
import { useActiveStorefronts } from '@/features/storefront/hook'

interface PartnerImageProps {
  name: string
  image: string
}

const PartnerImage = ({ name, image }: PartnerImageProps) => {
  const [bgColor, setBgColor] = useState<string>('#ffffff')
  const imgRef = useRef<HTMLImageElement>(null)

  const extractEdgeColor = () => {
    const img = imgRef.current
    if (img && img.complete && img.src && !img.src.includes('data:image')) {
      try {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (context) {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          context.drawImage(img, 0, 0)

          const data = context.getImageData(0, 0, 1, 1).data
          const r = data[0]
          const g = data[1]
          const b = data[2]
          const a = data[3]

          if (a < 255) {
            setBgColor('#ffffff')
          } else {
            setBgColor(`rgb(${r}, ${g}, ${b})`)
          }
        }
      } catch {
        setBgColor('#ffffff')
      }
    }
  }

  useEffect(() => {
    if (imgRef.current?.complete) {
      extractEdgeColor()
    }
  }, [image])

  return (
    <div className='flex h-32 w-full items-center justify-center'>
      <img
        ref={imgRef}
        alt={name}
        className='border-default-100 size-32 rounded-xl border object-contain'
        crossOrigin='anonymous'
        height={80}
        src={image || IMAGE_FALLBACK.EMPTY}
        style={{ backgroundColor: bgColor }}
        width={160}
        onLoad={extractEdgeColor}
      />
    </div>
  )
}

const PartnerSection = () => {
  const t = useTranslations('shared.partner')
  const { data: storefronts, isLoading } = useActiveStorefronts({
    ignoreAdmin: true,
  })

  if (isLoading) {
    return null
  }

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <SectionHeader description={t('description')} title={t('title')} />

        <div className='flex flex-wrap items-start justify-center'>
          {storefronts?.map((partner) => {
            return (
              <Link
                key={partner.id}
                className='flex w-80 flex-col items-center justify-start gap-5 p-4 text-center grayscale transition-all duration-300 hover:grayscale-0 lg:w-96'
                href={partner.googleMapUrl || '#'}
                rel='noopener noreferrer'
                target='_blank'
              >
                <PartnerImage
                  image={partner.image || IMAGE_FALLBACK.EMPTY}
                  name={partner.name}
                />
                <p className='max-w-3/4 text-lg tracking-tight antialiased opacity-70 sm:text-xl'>
                  {partner.name}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { PartnerSection }
