import { Input } from '@heroui/input'
import { SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <Input
      endContent={<SearchIcon className='text-default-500' />}
      placeholder='Find what you need here....'
      variant='faded'
    />
  )
}

export { Search }
