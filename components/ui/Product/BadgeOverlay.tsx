import { cn } from '@/utils'

interface BadgeOverlayProps {
  hasAnyDiscount?: boolean
  discount: number
  className?: string
}

const BadgeOverlay = ({
  hasAnyDiscount,
  discount,
  className,
}: BadgeOverlayProps) => {
  if (!hasAnyDiscount || discount <= 0) {
    return null
  }

  return (
    <div
      className={cn(
        'absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5',
        className,
      )}
    >
      <span className='inline-flex items-center rounded-full bg-red-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-xs transition-transform duration-200 group-hover:scale-105'>
        -{discount}%
      </span>
    </div>
  )
}

export { BadgeOverlay }
