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
  badge?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  link?: string
  linkLabel?: string
}

type SectionLabelProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
}

const SectionHeader = ({
  title,
  description,
  badge,
  className,
  as: Tag = 'h2',
  link,
  linkLabel,
  ...props
}: SectionHeaderProps) => {
  const t = useTranslations('actions')

  return (
    <div
      className={cn(
        'mx-auto flex max-w-3xl flex-col items-center text-center',
        className,
      )}
      {...props}
    >
      {/* Badge / Pill เหนือหัวข้อ (ถ้ามีส่งเข้ามา) */}
      {badge && <div className='mb-4'>{badge}</div>}

      {/* Main Title */}
      <Tag className='text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl'>
        {title}
      </Tag>

      {/* Description */}
      {description && (
        <p className='text-default-500 mt-4 max-w-2xl text-base leading-relaxed font-normal text-balance sm:text-lg md:text-xl'>
          {description}
        </p>
      )}

      {/* CTA Button ด้านล่าง จัดกึ่งกลาง */}
      {link && (
        <div className='mt-6 flex items-center justify-center'>
          <Button
            as={Link}
            className='group text-sm font-medium transition-all hover:gap-3'
            color='primary'
            endContent={
              <div className='bg-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full transition-colors'>
                <ArrowRightIcon className='size-3.5 transition-transform group-hover:translate-x-0.5' />
              </div>
            }
            href={link}
            radius='full'
            variant='flat'
          >
            {linkLabel || t('all')}
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * SectionLabel สไตล์ SaaS Badge / Chip
 */
const SectionLabel = ({ children, className, ...props }: SectionLabelProps) => {
  return (
    <span
      className={cn(
        'border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-wide uppercase shadow-xs',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { SectionHeader, SectionLabel }
