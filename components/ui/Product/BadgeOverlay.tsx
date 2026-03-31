interface BadgeOverlayProps {
  hasAnyDiscount?: boolean
  discount: number
}

const BadgeOverlay = ({ hasAnyDiscount, discount }: BadgeOverlayProps) => {
  return (
    <div className='absolute -top-2 -right-2 z-20 flex gap-2 md:top-8 md:right-8'>
      {hasAnyDiscount && discount > 0 && (
        <div className='flex size-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
          <span className='text-[8px] leading-none md:text-[10px]'>UP TO</span>
          <span className='text-sm md:text-xl'>{discount}%</span>
        </div>
      )}

      <div className='flex size-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-orange-500 font-bold text-white shadow-lg md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
        <span className='text-center text-[10px] leading-none'>
          LIMITED
          <br />
          STOCK
        </span>
      </div>
    </div>
  )
}

export { BadgeOverlay }
