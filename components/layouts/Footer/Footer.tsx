/* eslint-disable react/no-array-index-key */
import { useTranslations } from 'next-intl'

import type { FooterMenuSection } from './Footer.types'
import type { ComponentProps } from 'react'

import { FooterBottom } from './_components/FooterBottom'
import { FooterSection } from './_components/FooterSection'

import { cn } from '@/utils/style'

const Footer = ({ className, ...props }: ComponentProps<'footer'>) => {
  const tFooter = useTranslations('Footer')
  const menuData = tFooter.raw('Menu') as FooterMenuSection[]

  return (
    <footer
      {...props}
      className={cn(
        'border-divider border-t bg-white p-5 dark:bg-[#131314]',
        className,
      )}
    >
      <div className='container mx-auto grid gap-12 py-16 text-sm sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5'>
        {menuData.map((section, idx) => (
          <div key={idx} className='flex flex-col gap-6'>
            {section.title && !section.isGroup && (
              <span className='text-primary text-base font-bold uppercase'>
                {section.title}
              </span>
            )}

            <FooterSection section={section} />
          </div>
        ))}
      </div>

      <FooterBottom />
    </footer>
  )
}

export { Footer }
