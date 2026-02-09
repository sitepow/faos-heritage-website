'use client'

import { useCallback, useMemo, useState } from 'react'

interface Params {
  url: string
  title?: string
}

const useProductShare = ({ url, title = '' }: Params) => {
  const [copied, setCopied] = useState(false)

  const encodedUrl = useMemo(() => encodeURIComponent(url), [url])
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title])

  const platforms = useMemo(
    () => [
      {
        name: 'facebook',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
        name: 'twitter',
        url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      },
      {
        name: 'whatsapp',
        url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      },
    ],
    [encodedUrl, encodedTitle],
  )

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)

    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [url])

  return {
    copied,
    platforms,
    copy,
  }
}

export { useProductShare }
