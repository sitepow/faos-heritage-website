'use client'

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { toast } from 'react-toastify'

import type { ActionResult } from '@/lib/errors'
import type { PropsWithChildren } from 'react'

import { QUERY_GC_TIME, QUERY_STALE_TIME } from '@/constants/app'
import { ERROR_MESSAGE_MAP, ERROR_CODES } from '@/lib/errors'

function isActionResult(value: unknown): value is ActionResult<unknown> {
  if (typeof value !== 'object' || value === null) return false

  return (
    'success' in value &&
    typeof (value as { success: unknown }).success === 'boolean'
  )
}

const QueryProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME,
            gcTime: QUERY_GC_TIME,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onSuccess: (data) => {
            if (isActionResult(data) && !data.success) {
              toast.error(
                ERROR_MESSAGE_MAP[data.code] ??
                  ERROR_MESSAGE_MAP[ERROR_CODES.SYSTEM_ERROR],
              )
            }
          },

          onError: () => {
            toast.error(ERROR_MESSAGE_MAP[ERROR_CODES.SYSTEM_ERROR])
          },
        }),
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

export { QueryProviders }
