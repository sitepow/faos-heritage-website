'use client'

import { useEffect, useState } from 'react'

export const useIsBelowBreakpoint = (minWidth: string) => {
  const [isBelow, setIsBelow] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth})`)

    const update = () => setIsBelow(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [minWidth])

  return isBelow
}
