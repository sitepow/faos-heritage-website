'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import type { GetPostResult } from '@/features/post/post.action'

import { PostAuthor } from './_components/PostAuthor'
import { PostHeader } from './_components/PostHeader'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { DynamicBreadcrumb } from '@/components/ui/DynamicBreadcrumb'
import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { usePost } from '@/features/post/post.hook'
import { usePostMutation } from '@/features/post/post.mutation'

interface Props {
  initialData: GetPostResult
  postId: string
}

const PostClient = ({ initialData, postId }: Props) => {
  const locale = useLocale()
  const tBreadcrumb = useTranslations('navigation.breadcrumb')

  const { increaseView } = usePostMutation()
  const isIncreased = useRef(false)

  const { data: post } = usePost({
    id: postId,
    locale,
    initialData,
  })

  const currentPost = post || initialData

  useEffect(() => {
    if (!isIncreased.current && postId) {
      increaseView(postId)
      isIncreased.current = true
    }
  }, [postId, increaseView])

  if (!currentPost) {
    return null
  }

  const {
    title,
    content,
    featuredImage,
    category,
    author,
    publishedAt,
    viewCount = 0,
    summary,
  } = currentPost

  const breadcrumbItems = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('blog'), href: '/posts' },
    ...(category
      ? [
          {
            label: category.name,
            href: `/posts/category/${category.slug}`,
          },
        ]
      : []),
    { label: title, href: '#' },
  ]

  return (
    <Container>
      <AppSection>
        <DynamicBreadcrumb items={breadcrumbItems} />

        <article className='flex flex-col gap-5'>
          <PostHeader
            author={author}
            category={category}
            featuredImage={featuredImage}
            publishedAt={publishedAt}
            title={title}
            viewCount={viewCount}
          />

          {summary && (
            <div className='mx-auto w-full max-w-4xl'>
              <p className='text-default-600 border-primary border-l-4 pl-4 text-xl leading-relaxed italic'>
                {summary}
              </p>
            </div>
          )}

          <MarkdownRenderer
            className='mx-auto w-full max-w-[1280px]'
            content={content!}
            fallbackAlt={title!}
          />

          <PostAuthor author={author} />
        </article>
      </AppSection>
    </Container>
  )
}

export { PostClient }
