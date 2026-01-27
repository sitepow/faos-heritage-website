import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const NavbarSearch = () => {
  const t = useTranslations('Navbar')

  return (
    <div className='hidden flex-1 lg:block'>
      <div className='group relative max-w-[300px]'>
        <Input
          size='sm'
          variant='underlined'
          placeholder={t('search')}
          startContent={<SearchIcon />}
          classNames={{
            input: ['text-xs uppercase tracking-widest'],
            inputWrapper: [
              'border-b border-divider group-hover:border-primary transition-all duration-500',
              'after:bg-primary',
            ],
          }}
        />
      </div>
    </div>
  )
}

export { NavbarSearch }
