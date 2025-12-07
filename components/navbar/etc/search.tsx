import { Input } from '@heroui/input'
import { SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <Input
      endContent={
        <SearchIcon className='pointer-events-none flex-shrink-0 text-base text-default-400' />
      }
      labelPlacement='outside'
      placeholder='ค้นหาสิ่งที่ต้องการที่นี่...'
      type='search'
      variant='faded'
    />
  )
}

export { Search }
