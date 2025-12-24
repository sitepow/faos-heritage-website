'use client'

import { Input } from '@heroui/react'
import { SearchIcon } from 'lucide-react'

export const NavbarSearch = () => {
  return (
    <Input
      endContent={<SearchIcon className='text-default-500' />}
      placeholder='Find what you need here....'
      variant='faded'
    />
  )
}
