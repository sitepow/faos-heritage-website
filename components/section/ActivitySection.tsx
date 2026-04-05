/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { PostBrandBadge } from '../ui/Post/_components/PostBrandBadge'
import { SectionHeader } from '../ui/SectionHeader'

interface ActivityItem {
  images: string[]
  content: string
}

const ActivitySection = () => {
  const t = useTranslations()
  const [showAll, setShowAll] = useState(false)

  const activityShared = useTranslations('shared.activity')
  const activityData = t.raw('activity') as ActivityItem[]

  const toggleShowAll = () => {
    return setShowAll(!showAll)
  }

  return (
    <section className='flex flex-col gap-5'>
      <SectionHeader
        description={activityShared('description')}
        link='/'
        title={activityShared('title')}
      />

      {activityData.map((item, idx) => {
        const displayImages = showAll ? item.images : item.images.slice(0, 6)
        const remainingCount = item.images.length - 6

        return (
          <div key={idx} className='flex flex-col gap-5'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {displayImages.map((image, ide) => {
                const isLastVisibleCollapsed =
                  !showAll && ide === 5 && remainingCount > 0
                const isLastVisibleExpanded =
                  showAll && ide === item.images.length - 1

                return (
                  <div
                    key={ide}
                    className='relative cursor-pointer'
                    onClick={
                      isLastVisibleCollapsed || isLastVisibleExpanded
                        ? toggleShowAll
                        : undefined
                    }
                  >
                    <img
                      alt=''
                      className='aspect-square w-full rounded-xl object-cover'
                      src={image}
                    />
                    <PostBrandBadge hasImage />

                    {isLastVisibleCollapsed && (
                      <div className='absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/60 text-white'>
                        <span className='text-xl font-bold'>
                          +{remainingCount}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p
              dangerouslySetInnerHTML={{ __html: item.content }}
              className='text-lg text-black/70 sm:text-xl dark:text-white/70 [&>normal]:text-black dark:[&>normal]:text-white'
            />
          </div>
        )
      })}
    </section>
  )
}

export { ActivitySection }
