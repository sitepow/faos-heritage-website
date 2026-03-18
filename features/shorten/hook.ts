import { useMutation } from '@tanstack/react-query'

import { createShortLinkAction } from './action'

const useShortenMutation = () => {
  return useMutation({
    mutationFn: async (longUrl: string) => {
      const result = await createShortLinkAction(longUrl)
      if (!result.success) {
        throw new Error(result.error || 'Failed to shorten URL')
      }
      return result
    },
  })
}

export { useShortenMutation }
