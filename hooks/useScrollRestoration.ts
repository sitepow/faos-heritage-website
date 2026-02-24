'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const useScrollRestoration = () => {
  const pathname = usePathname()

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem(`scrollPos:${pathname}`)

    if (savedScrollPos) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedScrollPos, 10))
      })
    }

    const handleScroll = () => {
      sessionStorage.setItem(`scrollPos:${pathname}`, window.scrollY.toString())
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])
}

export { useScrollRestoration }
