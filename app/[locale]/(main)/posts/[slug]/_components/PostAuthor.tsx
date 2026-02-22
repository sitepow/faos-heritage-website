'use client'

import { PostAuthorAvatar } from '@/components/ui/Post/PostAuthorAvatar'

interface Props {
  author?: { name: string | null; image: string | null } | null
}

const PostAuthor = ({ author }: Props) => {
  return (
    <footer className='border-default-100 flex flex-col items-center gap-5 rounded-lg border p-7 text-center sm:flex-row sm:items-start sm:gap-8 sm:p-10 sm:text-start lg:p-12'>
      <PostAuthorAvatar
        author={author}
        className='size-24 shrink-0 shadow-sm sm:size-28'
        iconSize={48}
      />

      <div className='flex flex-col gap-3'>
        <h4 className='text-default-900 text-2xl font-bold sm:text-3xl'>
          Written by {author?.name!}
        </h4>

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
