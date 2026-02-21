'use client'

import { useTranslations } from 'next-intl'

import type { getPost } from '@/features/post/post.action'

import { PostAuthor } from './_components/PostAuthor'
import { PostHeader } from './_components/PostHeader'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { DynamicBreadcrumb } from '@/components/ui/DynamicBreadcrumb'
import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { usePost } from '@/features/post/post.hook'

type PostResult = Awaited<ReturnType<typeof getPost>>

interface Props {
  initialData: PostResult
  postId: string
}

const PostClient = ({ initialData, postId }: Props) => {
  const tBreadcrumb = useTranslations('navigation.breadcrumb')

  const { data: post } = usePost(postId)
  const currentPost = post || initialData

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
            href: `/posts?categoryId=${category.id}`,
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
