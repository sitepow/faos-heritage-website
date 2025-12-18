import { useEffect } from 'react'

interface Params {
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  threshold?: number
}

const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 300,
}: Params) => {
  useEffect(() => {
    const onScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - threshold

      if (isAtBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    const checkInitialLoad = () => {
      if (
        document.documentElement.scrollHeight <= window.innerHeight &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
      }
    }

    const timeoutId = setTimeout(checkInitialLoad, 100)

    window.addEventListener('scroll', onScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold])
}

export { useInfiniteScroll }
