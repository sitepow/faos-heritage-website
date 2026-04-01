'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import type { GetPostResult } from '@/features/post/action'

import { PostAuthor } from './_components/PostAuthor'
import { PostHeader } from './_components/PostHeader'
import { RelatedPosts } from './_components/RelatedPosts'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { DynamicBreadcrumb } from '@/components/ui/DynamicBreadcrumb'
import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { CommentSection } from '@/features/comment/ui/CommentSection'
import { usePost } from '@/features/post/hook'
import { usePostMutation } from '@/features/post/mutation'

interface Props {
  initialData: GetPostResult
  slug: string
}

const PostClient = ({ initialData, slug }: Props) => {
  const locale = useLocale()
  const tBreadcrumb = useTranslations('navigation.breadcrumb')
  const { increaseView } = usePostMutation()
  const isIncreased = useRef(false)

  const { data: post } = usePost({
    slug,
    locale,
    initialData,
  })

  const currentPost = post || initialData

  useEffect(() => {
    if (!isIncreased.current && slug) {
      increaseView(slug)
      isIncreased.current = true
    }
  }, [slug, increaseView])

  if (!currentPost) {
    return null
  }

  const {
    id: postId,
    title,
    content,
    featuredImage,
    category,
    author,
    publishedAt,
    viewCount = 0,
    summary,
    _count,
  } = currentPost

  const breadcrumbItems = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('blog'), href: '/posts' },
    ...(category
      ? [{ label: category.name, href: `/posts/category/${category.slug}` }]
      : []),
    { label: title, href: '#' },
  ]

  return (
    <Container>
      <AppSection>
        <nav aria-label='Breadcrumb'>
          <DynamicBreadcrumb items={breadcrumbItems} />
        </nav>

        <article className='flex flex-col gap-5'>
          <PostHeader
            author={author}
            category={category}
            commentCount={_count?.comments || 0}
            featuredImage={featuredImage}
            publishedAt={publishedAt}
            title={title}
            viewCount={viewCount}
          />

          {summary && (
            <section
              aria-label='Post summary'
              className='mx-auto my-5 w-full max-w-4xl'
            >
              <p className='text-default-600 border-primary border-l-4 pl-4 text-lg leading-relaxed tracking-tight antialiased sm:text-xl'>
                {summary}
              </p>
            </section>
          )}

          <section aria-label='Post content' className='w-full'>
            <MarkdownRenderer
              className='mx-auto w-full max-w-[1280px]'
              content={content!}
              fallbackAlt={title!}
            />
          </section>

          <PostAuthor author={author} />

          <aside aria-label='Related articles'>
            <RelatedPosts
              categoryId={currentPost.categoryId}
              excludeId={postId}
            />
          </aside>

          <section aria-label='Post comments' id='comments'>
            <CommentSection postId={postId} />
          </section>
        </article>
      </AppSection>
    </Container>
  )
}

export { PostClient }
