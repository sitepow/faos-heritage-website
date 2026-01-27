import { useCallback, useEffect } from 'react'

interface UseWindowInfiniteScrollParams {
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  threshold?: number
}

const useWindowInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 300,
}: UseWindowInfiniteScrollParams) => {
  const canFetchMore = hasNextPage && !isFetchingNextPage

  const handleFetchNext = useCallback(() => {
    if (!canFetchMore) return
    fetchNextPage()
  }, [canFetchMore, fetchNextPage])

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    if (isNearBottom) {
      handleFetchNext()
    }
  }, [handleFetchNext, threshold])

  const checkInitialLoad = useCallback(() => {
    const { scrollHeight, clientHeight } = document.documentElement

    if (scrollHeight <= clientHeight) {
      handleFetchNext()
    }
  }, [handleFetchNext])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    const timeoutId = window.setTimeout(checkInitialLoad, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.clearTimeout(timeoutId)
    }
  }, [handleScroll, checkInitialLoad])
}

export { useWindowInfiniteScroll }
