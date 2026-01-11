/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useRef } from 'react'

export function useDebouncedChange<T>(
  onChange: (value: T) => void,
  delay = 500,
) {
  const timer = useRef<NodeJS.Timeout | null>(null)

  return (value: T) => {
    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      onChange(value)
    }, delay)
  }
}
