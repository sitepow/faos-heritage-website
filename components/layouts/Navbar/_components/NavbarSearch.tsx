import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const NavbarSearch = () => {
  const t = useTranslations('Navbar')

  return (
    <div className='hidden flex-1 lg:block'>
      <div className='group relative max-w-[300px]'>
        <Input
          classNames={{
            input: ['text-xs uppercase tracking-widest'],
            inputWrapper: [
              'border-b border-divider group-hover:border-primary transition-all duration-300',
              'after:bg-primary',
            ],
          }}
          placeholder={t('search')}
          size='sm'
          startContent={
            <SearchIcon className='group-focus-within:text-primary transition-all duration-300' />
          }
          variant='underlined'
        />
      </div>
    </div>
  )
}

export { NavbarSearch }
