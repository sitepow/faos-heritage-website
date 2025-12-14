import { Input } from '@heroui/input'
import { SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <Input
      endContent={<SearchIcon className='text-default-500' />}
      placeholder='ค้นหาสิ่งที่ต้องการที่นี่...'
      variant='faded'
    />
  )
}

export { Search }
