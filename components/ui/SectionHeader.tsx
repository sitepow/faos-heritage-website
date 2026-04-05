'use client'
import { Button } from '@heroui/react'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utils/style'

type SectionHeaderProps = ComponentPropsWithoutRef<'div'> & {
  title: ReactNode
  description?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  link?: string
}

type SectionLabelProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
}

const SectionHeader = ({
  title,
  description,
  className,
  as: Tag = 'h2',
  link,
  ...props
}: SectionHeaderProps) => {
  const t = useTranslations('actions')
  return (
    <div
      className={cn(
        'flex items-center gap-5',
        !link ? 'flex-col text-center' : 'flex-wrap justify-between',
        className,
      )}
      {...props}
    >
      <div>
        <Tag className='text-3xl leading-tight font-bold sm:text-4xl'>
          {title}
        </Tag>

        <p
          className={cn(
            'w-full text-lg opacity-70 sm:max-w-[75%] sm:text-xl',
            !link && 'mx-auto',
          )}
        >
          {description}
        </p>
      </div>

      {link && (
        <Button
          as={Link}
          className='text-primary'
          endContent={
            <div className='bg-primary flex size-6 shrink-0 items-center justify-center rounded-full'>
              <ArrowRightIcon className='text-white' size={15} />
            </div>
          }
          href={link}
          radius='full'
          variant='bordered'
        >
          {t('all')}
        </Button>
      )}
    </div>
  )
}
const SectionLabel = ({ children, className, ...props }: SectionLabelProps) => {
  return (
    <span
      className={cn(
        'border-default-100 text-default-500 block w-fit border-b pb-1 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { SectionHeader, SectionLabel }
