'use client'

import { useEffect, useState } from 'react'

const useIsBelowBreakpoint = (minWidth: string) => {
  const [isBelow, setIsBelow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(`(min-width: ${minWidth})`)

    const update = () => {
      setIsBelow(!mediaQuery.matches)
    }

    update()
    mediaQuery.addEventListener('change', update)

    return () => {
      mediaQuery.removeEventListener('change', update)
    }
  }, [minWidth])

  return isBelow
}

export { useIsBelowBreakpoint }
