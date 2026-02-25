'use client'

import { useTranslations } from 'next-intl'

import { Container } from '../../Container'

import { CURRENCY_LOCALE_MAP } from '@/constants'
import { Link } from '@/i18n/navigation'

const FooterBottom = () => {
  const tFooter = useTranslations('footer')
  const tBrand = useTranslations('brand')
  const tCountry = useTranslations('global.country')

  const year = new Date().getFullYear()

  return (
    <Container className='border-default-100 text-default-500 flex flex-col items-center justify-between gap-5 border-t py-8 text-xs xl:flex-row'>
      <small className='text-xs'>
        {tFooter('copyright', { year, name: tBrand('name') })}
      </small>

      <nav
        aria-label='Country Selector'
        className='flex flex-wrap items-center justify-center gap-1'
      >
        <span className='mr-1'>{tFooter('countryLabel')}</span>

        {CURRENCY_LOCALE_MAP.map((c) => (
          <Link
            key={c.country}
            className='border-default-100 hover:bg-primary/10 hover:text-primary cursor-pointer rounded-full border px-3 py-1 transition'
            href='/'
            locale={c.country.toLowerCase()}
          >
            {tCountry(c.country)}
          </Link>
        ))}
      </nav>
    </Container>
  )
}

export { FooterBottom }
