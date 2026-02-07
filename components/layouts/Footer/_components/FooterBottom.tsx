import { useTranslations } from 'next-intl'

import { CURRENCY_LOCALE_MAP } from '@/constants'

const FooterBottom = () => {
  const translateFooter = useTranslations('footer')
  const translateBrand = useTranslations('brand')
  const translateCountry = useTranslations('global.country')

  const year = new Date().getFullYear()

  return (
    <div className='border-default-100 container mx-auto flex flex-col items-center justify-between gap-5 border-t py-8 text-xs text-gray-400 xl:flex-row'>
      <p className='font-medium'>
        {translateFooter('copyright', { year, name: translateBrand('name') })}
      </p>

      <div className='flex flex-wrap items-center justify-center gap-2'>
        <span className='tracking-tight uppercase'>
          {translateFooter('countryLabel')}
        </span>

        {CURRENCY_LOCALE_MAP.map((c) => (
          <button
            key={c.country}
            className='border-default-100 hover:bg-primary/10 hover:text-primary cursor-pointer rounded-full border px-3 py-1 transition'
          >
            {translateCountry(c.country)}
          </button>
        ))}
      </div>
    </div>
  )
}

export { FooterBottom }
