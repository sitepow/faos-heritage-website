/* eslint-disable no-unused-vars */
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue>

const useUrlQuery = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const buildParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const setQueryParam = useCallback(
    (key: string, value: QueryValue) => {
      buildParams((params) => {
        if (value === null || value === undefined) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })
    },
    [buildParams],
  )

  const setQueryParams = useCallback(
    (newParams: QueryParams) => {
      buildParams((params) => {
        Object.entries(newParams).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            params.delete(key)
          } else {
            params.set(key, String(value))
          }
        })
      })
    },
    [buildParams],
  )

  const removeQueryParam = useCallback(
    (key: string) => {
      buildParams((params) => {
        params.delete(key)
      })
    },
    [buildParams],
  )

  const getQueryParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  )

  return {
    setQueryParam,
    setQueryParams,
    removeQueryParam,
    getQueryParam,
  }
}

export { useUrlQuery }
