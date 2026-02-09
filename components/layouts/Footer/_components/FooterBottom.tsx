import { useTranslations } from 'next-intl'

import { Container } from '../../Container'

import { CURRENCY_LOCALE_MAP } from '@/constants'

const FooterBottom = () => {
  const tFooter = useTranslations('footer')
  const tBrand = useTranslations('brand')
  const tCountry = useTranslations('global.country')

  const year = new Date().getFullYear()

  return (
    <Container className='border-default-100 text-default-500 flex flex-col items-center justify-between gap-5 border-t py-8 text-xs xl:flex-row'>
      <p>{tFooter('copyright', { year, name: tBrand('name') })}</p>

      <div className='flex flex-wrap items-center justify-center gap-1'>
        <p>{tFooter('countryLabel')}</p>

        {CURRENCY_LOCALE_MAP.map((c) => (
          <button
            key={c.country}
            className='border-default-100 hover:bg-primary/10 hover:text-primary cursor-pointer rounded-full border px-2 py-0.5 transition'
          >
            {tCountry(c.country)}
          </button>
        ))}
      </div>
    </Container>
  )
}

export { FooterBottom }
