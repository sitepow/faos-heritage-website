import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

import { useCategories } from '@/features/category/useCategory'

const NavbarMenu = () => {
  const { data: categories } = useCategories()

  return (
    <Container className='hidden justify-center gap-5 lg:flex'>
      {categories?.map(({ name }) => {
        return <MenuItem key={name} label={name} />
      })}
    </Container>
  )
}

export { NavbarMenu }
