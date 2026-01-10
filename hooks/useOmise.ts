/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Omise: any
    OmiseCard: any
  }
}

interface UseOmiseOptions {
  publicKey?: string
}

interface OmiseCardOpenOptions {
  amount: number
  currency: string
  defaultPaymentMethod?: string
  otherPaymentMethods?: string
  onCreateTokenSuccess?: (nonce: string) => void
}

export const useOmise = (options?: UseOmiseOptions) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadScript = () => {
      const existingScript = document.querySelector(
        'script[src="https://cdn.omise.co/omise.js"]',
      )

      if (existingScript) {
        if (window.OmiseCard) {
          setIsLoaded(true)
          setIsLoading(false)
          configureOmise()
        } else {
          existingScript.addEventListener('load', () => {
            setIsLoaded(true)
            setIsLoading(false)
            configureOmise()
          })
        }
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.omise.co/omise.js'
      script.async = true
      script.onload = () => {
        setIsLoaded(true)
        setIsLoading(false)
        configureOmise()
      }
      document.head.appendChild(script)
    }

    const configureOmise = () => {
      const publicKey =
        options?.publicKey || process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!
      window.OmiseCard?.configure({ publicKey })
    }

    loadScript()
  }, [options?.publicKey])

  const openPaymentForm = (config: OmiseCardOpenOptions) => {
    if (!isLoaded || !window.OmiseCard) return
    window.OmiseCard.open(config)
  }

  return { isLoaded, isLoading, openPaymentForm }
}
