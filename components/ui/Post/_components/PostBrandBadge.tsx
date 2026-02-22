import { cn } from '@/utils'

interface Props {
  hasImage?: boolean
}

const PostBrandBadge = ({ hasImage }: Props) => {
  return (
    <div className='absolute top-6 right-6 z-20 select-none'>
      <div
        className={cn(
          'border-b pb-1 text-[13px] font-medium tracking-[0.12em] uppercase',
          hasImage
            ? 'border-white/40 text-white/85'
            : 'border-black/30 text-black/70',
        )}
      >
        FAOS ORIGINAL
      </div>
    </div>
  )
}

export { PostBrandBadge }
