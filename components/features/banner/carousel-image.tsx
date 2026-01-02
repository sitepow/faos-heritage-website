'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

import { getImageBanners } from '../../../app/(dashboard)/_components/manager/banner/action'
import { Carousel } from '../carousel'

export const CarouselImageBanner = () => {
  const { data: banners } = useQuery({
    queryKey: ['public', 'image-banners'],
    queryFn: getImageBanners,
  })

  const activeBanners = banners?.filter((banner) => banner.isActive) ?? []

  return (
    <Carousel
      slidesToScroll
      autoPlay
      loop
      wrapperClassName='w-full'
      trackClassName='items-stretch'
    >
      {activeBanners.map((banner, index) => (
        <div className='relative h-[300px] min-w-full overflow-hidden rounded-xl bg-gradient-to-b from-black/40 to-black/60 md:h-[420px]'>
          <Image
            src={banner.url}
            alt=''
            fill
            className='scale-110 object-cover blur-2xl'
          />
          <Image
            src={banner.url}
            alt={banner.alt ?? `banner-${index}`}
            fill
            className='object-contain'
          />
        </div>
      ))}
    </Carousel>
  )
}
