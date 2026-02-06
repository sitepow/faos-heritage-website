import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const NavbarSearch = () => {
  const translateNavigation = useTranslations('navigation.navbar')

  return (
    <div className='hidden flex-1 lg:block'>
      <div className='group relative max-w-[300px]'>
        <Input
          classNames={{
            inputWrapper: ['after:bg-tranparent'],
          }}
          placeholder={translateNavigation('search')}
          size='lg'
          startContent={<SearchIcon className='text-default-200' />}
          variant='underlined'
        />
      </div>
    </div>
  )
}

export { NavbarSearch }
