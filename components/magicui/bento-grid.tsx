import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils'

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<'div'> {
  background?: ReactNode
  className?: string
  cta?: string
  description: string
  href?: string
  Icon: ElementType
  name: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  Icon,
  background,
  className,
  cta,
  description,
  href,
  name,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl',
      // light styles
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.04),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      // dark styles
      'transform-gpu dark:bg-neutral-900/80 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]',
      className,
    )}
    {...props}
  >
    <div className='absolute inset-0 z-0 overflow-hidden'>{background}</div>

    <div className='pointer-events-none z-10 flex transform-gpu flex-col gap-1.5 p-6 transition-all duration-300 group-hover:-translate-y-8'>
      <div className='flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-all duration-300 group-hover:scale-90 dark:bg-amber-400/15 dark:text-amber-400'>
        <Icon className='size-6' />
      </div>
      <h3 className='mt-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100'>
        {name}
      </h3>
      <p className='max-w-lg text-sm leading-relaxed text-neutral-600 dark:text-neutral-400'>
        {description}
      </p>
    </div>

    {href && cta ? (
      <>
        <div className='pointer-events-none z-10 flex w-full translate-y-0 transform-gpu flex-row items-center px-6 pb-6 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden'>
          <Button
            asChild
            className='pointer-events-auto p-0 font-semibold text-amber-600 dark:text-amber-400'
            size='sm'
            variant='link'
          >
            <Link
              className='inline-flex items-center gap-1.5 text-xs font-semibold'
              href={href}
            >
              <span>{cta}</span>
              <ArrowRight className='size-3.5' />
            </Link>
          </Button>
        </div>

        <div className='pointer-events-none absolute bottom-0 z-10 hidden w-full translate-y-10 transform-gpu flex-row items-center px-6 pb-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex'>
          <Button
            asChild
            className='pointer-events-auto p-0 font-semibold text-amber-600 dark:text-amber-400'
            size='sm'
            variant='link'
          >
            <Link
              className='inline-flex items-center gap-1.5 text-xs font-semibold'
              href={href}
            >
              <span>{cta}</span>
              <ArrowRight className='size-3.5' />
            </Link>
          </Button>
        </div>
      </>
    ) : null}

    <div className='pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/5 group-hover:dark:bg-white/5' />
  </div>
)

export { BentoCard, BentoGrid }
