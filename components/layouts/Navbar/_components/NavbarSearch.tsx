'use client'

import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/utils'

interface NavbarSearchProps {
  className?: string
  placeholder?: string
  onSearchSubmit?: () => void
}

const NavbarSearch = ({
  className,
  placeholder,
  onSearchSubmit,
}: NavbarSearchProps) => {
  const tNavigation = useTranslations('navigation.navbar')
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`)
      onSearchSubmit?.()
    }
  }

  return (
    <form
      className={cn('relative flex items-center', className)}
      onSubmit={handleSearch}
    >
      <div className='relative w-full'>
        <Search className='pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500' />
        <Input
          className='h-8 w-full rounded-full border-neutral-200/80 bg-neutral-100/80 pr-7 pl-8 text-xs transition-all duration-200 placeholder:text-neutral-400 focus-visible:border-[#ba8c25] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#ba8c25]/30 dark:border-neutral-800 dark:bg-neutral-900/80 dark:placeholder:text-neutral-500 dark:focus-visible:border-[#f59e0b] dark:focus-visible:bg-neutral-950 dark:focus-visible:ring-[#f59e0b]/30'
          placeholder={placeholder || tNavigation('search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            aria-label='Clear search'
            className='absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
            type='button'
            onClick={() => setQuery('')}
          >
            <X className='h-3 w-3' />
          </button>
        )}
      </div>
    </form>
  )
}

export { NavbarSearch }
