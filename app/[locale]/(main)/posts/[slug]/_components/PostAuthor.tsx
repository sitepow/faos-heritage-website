'use client'

import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

import { PostAuthorAvatar } from '@/components/ui/Post/PostAuthorAvatar'

interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
}

interface Props {
  author?: {
    name: string | null
    image: string | null
    socials?: SocialLinks
  } | null
}

const SOCIAL_MAP = [
  { id: 'facebook', Icon: Facebook },
  { id: 'twitter', Icon: Twitter },
  { id: 'instagram', Icon: Instagram },
  { id: 'linkedin', Icon: Linkedin },
] as const

const PostAuthor = ({ author }: Props) => {
  const socials = author?.socials || {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  }

  return (
    <footer className='border-default-100 mx-auto flex flex-col items-center gap-5 rounded-lg border p-7 text-center sm:flex-row sm:items-start sm:gap-8 sm:p-10 sm:text-start lg:max-w-3/4 lg:p-12 xl:max-w-1/2'>
      <div className='shrink-0'>
        <PostAuthorAvatar
          author={author}
          className='size-24 shadow-sm sm:size-28'
          iconSize={48}
        />
      </div>

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <h4 className='text-default-900 text-2xl font-bold'>
            {author?.name!}
          </h4>

          <nav
            aria-label='Author socials'
            className='flex items-center justify-center gap-3 sm:justify-start'
          >
            {SOCIAL_MAP.map(({ id, Icon }) => {
              const href = socials[id as keyof SocialLinks]
              if (!href) {
                return null
              }

              return (
                <Link
                  key={id}
                  className='text-default-400 hover:text-primary transition-colors'
                  href={href}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <Icon size={18} />
                </Link>
              )
            })}
          </nav>
        </div>

        <p className='text-default-600 max-w-2xl text-base leading-relaxed sm:text-lg'>
          Sharing insights about premium Greek organic olive oil, natural honey,
          and the Mediterranean lifestyle to help you achieve optimal
          well-being.
        </p>
      </div>
    </footer>
  )
}

export { PostAuthor }
