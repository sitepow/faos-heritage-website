import { useCategories } from '@/features/category/useCategory'

const NavbarMenu = () => {
  const { data: categories } = useCategories()

  return (
    <div className='container mx-auto flex justify-center gap-5'>
      {categories?.map(({ name }) => {
        return (
          <span
            key={name}
            className='text-default-500 hover:text-foreground cursor-pointer text-lg'
          >
            {name}
          </span>
        )
      })}
    </div>
  )
}

export { NavbarMenu }
