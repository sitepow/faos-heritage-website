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
    <div className='border-default-100 bg-default-50/50 flex flex-col gap-6 rounded-2xl border p-6 transition-all hover:bg-white hover:shadow-sm dark:hover:bg-neutral-900'>
      <div className='flex items-center gap-4'>
        <div className='shrink-0'>
          <PostAuthorAvatar
            author={author}
            className='ring-default-100 size-16 ring-2 ring-offset-2'
            iconSize={24}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-default-400 text-xs font-medium tracking-wider uppercase'>
            Written By
          </span>
          <h4 className='text-default-900 text-lg leading-tight font-bold'>
            {author?.name || 'Admin'}
          </h4>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <p className='text-default-600 text-sm leading-relaxed antialiased'>
          Sharing insights about premium Greek organic olive oil, natural honey,
          and the Mediterranean lifestyle to help you achieve optimal
          well-being.
        </p>

        <div className='border-default-100 mt-2 flex items-center justify-between border-t pt-4'>
          <span className='text-default-500 text-xs font-medium'>
            Follow Author
          </span>
          <nav aria-label='Author socials' className='flex items-center gap-3'>
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
                  <Icon size={16} />
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export { PostAuthor }
