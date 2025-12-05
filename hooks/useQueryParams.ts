import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const useQueryParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setQueryParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set(key, value)
      router.replace(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const setQueryParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value)
      })
      router.replace(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const removeQueryParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.delete(key)
      router.replace(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const getQueryParam = useCallback(
    (key: string) => {
      return searchParams.get(key)
    },
    [searchParams],
  )

  return {
    setQueryParam,
    setQueryParams,
    removeQueryParam,
    getQueryParam,
  }
}

export { useQueryParams }
