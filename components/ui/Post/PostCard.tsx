/* eslint-disable @next/next/no-img-element */
'use client'

import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { memo } from 'react'

import type { Prisma } from '@prisma/client'

import { IMAGE_FALLBACK } from '@/constants'
import { cn, formatDate } from '@/utils'

type PostListItem = Prisma.PostGetPayload<{
  include: {
    category: { select: { name: true } }
    author: { select: { name: true; image: true } }
    _count: {
      select: { comments: true }
    }
  }
}>

interface Props {
  className?: string
  featured?: boolean
  post: PostListItem
}

const PostCardSkeleton = ({ featured = false }: { featured?: boolean }) => {
  return (
    <div
      className={cn(
        'flex animate-pulse flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900',
        featured ? 'sm:col-span-2 lg:col-span-2' : 'col-span-1',
      )}
    >
      <div
        className={cn(
          'w-full bg-neutral-200 dark:bg-neutral-800',
          featured ? 'h-56 sm:h-72' : 'h-48',
        )}
      />
      <div className='flex flex-col gap-3 p-5 sm:p-6'>
        <div className='h-3 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800' />
        <div className='h-5 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-800' />
        <div className='h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-800' />
      </div>
    </div>
  )
}

const PostCard = memo(({ className, featured = false, post }: Props) => {
  const locale = useLocale()
  const { slug, title, summary, featuredImage, category, createdAt } = post
  const postHref = `/posts/${slug}`
  const formattedDate = formatDate(createdAt, locale, 'date') || ''

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/70 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-amber-400/40',
        featured ? 'sm:col-span-2 lg:col-span-2' : 'col-span-1',
        className,
      )}
    >
      <Link
        className='relative block w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800'
        href={postHref}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden',
            featured ? 'h-56 sm:h-72' : 'h-48',
          )}
        >
          <img
            alt={title}
            className='size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
            src={featuredImage || IMAGE_FALLBACK.EMPTY}
          />
          {category?.name && (
            <div className='absolute top-3 left-3 flex flex-wrap gap-1.5'>
              <span className='inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-800 shadow-xs backdrop-blur-md dark:bg-neutral-900/90 dark:text-neutral-200'>
                <Tag className='size-3 text-amber-600 dark:text-amber-400' />
                {category.name}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className='flex flex-1 flex-col justify-between p-5 sm:p-6'>
        <div className='space-y-2.5'>
          {/* Date & Reading time */}
          <div className='flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400'>
            {formattedDate && (
              <span className='inline-flex items-center gap-1'>
                <Calendar className='size-3' />
                {formattedDate}
              </span>
            )}
            <span className='inline-flex items-center gap-1'>
              <Clock className='size-3' />3 นาทีในการอ่าน
            </span>
          </div>

          {/* Title */}
          <Link href={postHref}>
            <h3
              className={cn(
                'line-clamp-2 font-bold text-neutral-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400',
                featured ? 'text-lg sm:text-xl' : 'text-base sm:text-lg',
              )}
            >
              {title}
            </h3>
          </Link>

          {/* Excerpt */}
          {summary && (
            <p className='line-clamp-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-300'>
              {summary}
            </p>
          )}
        </div>

        {/* Read more CTA */}
        <div className='pt-4'>
          <Link
            className='inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300'
            href={postHref}
          >
            <span>อ่านเพิ่มเติม</span>
            <ArrowRight className='size-3.5 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>
      </div>
    </article>
  )
})

export { PostCard, PostCardSkeleton }
