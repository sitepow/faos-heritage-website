/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef } from 'react'

const useDebouncedChange = <T>(onChange: (value: T) => void, delay = 500) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const debouncedChange = useCallback(
    (value: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        onChangeRef.current(value)
      }, delay)
    },
    [delay],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return debouncedChange
}

export { useDebouncedChange }
