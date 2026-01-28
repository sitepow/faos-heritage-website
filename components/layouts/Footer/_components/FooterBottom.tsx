import { useTranslations } from 'next-intl'

import { CURRENCY_LOCALE_MAP } from '@/constants/app'

const FooterBottom = () => {
  const tFooter = useTranslations('Footer')
  const tSite = useTranslations('Site')
  const tCountry = useTranslations('Country')
  const year = new Date().getFullYear()

  return (
    <div className='border-divider container mx-auto flex flex-col gap-6 border-t py-8 text-xs text-gray-400 md:flex-row md:justify-between'>
      <div>
        <p className='font-medium'>
          {tFooter('copyright', { year, name: tSite('name') })}
        </p>
        <div className='bg-primary/20 mt-1 h-1 w-12 rounded-full' />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <span className='tracking-tight uppercase'>{tFooter('country')}</span>

        {CURRENCY_LOCALE_MAP.map((c) => (
          <button
            key={c.country}
            className='border-divider hover:bg-primary/10 hover:text-primary cursor-pointer rounded-full border px-3 py-1 transition'
          >
            {tCountry(c.country)}
          </button>
        ))}
      </div>
    </div>
  )
}

export { FooterBottom }
