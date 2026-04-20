'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Container } from '@/components/layouts/Container'
import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { useFaq } from '@/features/faq/hook'

interface FaqClientProps {
  slug: string
  locale: string
}

const FaqClient = ({ slug, locale }: FaqClientProps) => {
  const router = useRouter()
  const { data, isLoading } = useFaq(slug, locale)
  const localization = data?.localizations?.[0]

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/')
    }
  }, [data, isLoading, router])

  return (
    <Container>
      <div className='mx-auto max-w-4xl space-y-6 text-center'>
        <h1 className='text-4xl leading-tight font-extrabold tracking-tight md:text-5xl lg:text-6xl'>
          {localization?.title!}
        </h1>
      </div>

      <div className='mx-auto max-w-3xl py-12'>
        <MarkdownRenderer
          content={localization?.content!}
          fallbackAlt={localization?.title!}
        />
      </div>
    </Container>
  )
}

export { FaqClient }
