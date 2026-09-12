'use client'

import { PostStatus } from '@prisma/client'
import { ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import type { GetPostsInfiniteResult } from '@/features/post/action'

import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { PostSection } from '@/components/ui/Post/PostSection'
import { Button } from '@/components/ui/button'
import { usePosts } from '@/features/post/hook'
import { useGsapReveal } from '@/hooks/useGsap'

interface Props {
  initialData?: GetPostsInfiniteResult
  itemsPerPage: number
}

const PostExploreSection = ({ initialData, itemsPerPage }: Props) => {
  const locale = useLocale()
  const tLanding = useTranslations('landing.postExplore')
  const containerRef = useGsapReveal({ stagger: 0.1, y: 25 })

  const { data: postsData, isLoading: isPostsLoading } = usePosts({
    initialData,
    limit: itemsPerPage,
    locale,
    status: PostStatus.PUBLISHED,
  })

  const posts = postsData?.items ?? []

  if (!isPostsLoading && posts.length === 0) {
    return null
  }

  return (
    <section
      ref={containerRef}
      className='relative w-full py-12 sm:py-16 md:py-20'
      id='blogs'
    >
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Center Header (sitepow.store style) */}
        <div className='gsap-reveal mx-auto mb-10 flex max-w-3xl flex-col items-center space-y-3 px-3 text-center'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300'>
            <BookOpen className='size-3.5' />
            <AnimatedShinyText className='text-xs font-bold tracking-wide text-amber-900 dark:text-amber-200'>
              {tLanding('tag')}
            </AnimatedShinyText>
          </span>

          <h2 className='text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white'>
            {tLanding('title')}
          </h2>

          <p className='max-w-xl text-xs leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300'>
            {tLanding('description')}
          </p>
        </div>

        {/* Blog Cards Grid (sitepow.store asymmetric layout) */}
        <div className='gsap-reveal'>
          <PostSection
            featuredFirst
            isLoading={isPostsLoading}
            itemPerPage={itemsPerPage}
            items={posts}
          />
        </div>

        {/* View all articles button (sitepow.store style) */}
        <div className='gsap-reveal mt-10 flex justify-center'>
          <Button
            asChild
            className='h-11 rounded-full border-neutral-300/80 bg-white/70 px-7 text-sm font-semibold text-neutral-800 shadow-xs backdrop-blur-md transition-all hover:border-amber-500 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-900/70 dark:text-neutral-100 dark:hover:border-amber-400 dark:hover:bg-neutral-800'
            variant='outline'
          >
            <Link href='/posts'>
              <span>{tLanding('viewAll')}</span>
              <ArrowRight className='size-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export { PostExploreSection }
