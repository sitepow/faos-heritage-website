import { useRouter } from 'next/navigation'

import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

import { useCategories } from '@/features/category/useCategory'
import { generateSlugWithId } from '@/utils'

const NavbarMenu = () => {
  const router = useRouter()
  const { data: categories } = useCategories()

  return (
    <Container className='hidden justify-center gap-5 lg:flex'>
      {categories?.map(({ name, id }) => {
        return (
          <MenuItem
            key={name}
            label={name}
            onClick={() => {
              router.push(`/categories/${generateSlugWithId(name!, id!)}`)
            }}
          />
        )
      })}
    </Container>
  )
}

export { NavbarMenu }
