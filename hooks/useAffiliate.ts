'use client'

import Cookies from 'js-cookie'
import { useEffect, useCallback } from 'react'

import { useUrlQuery } from './useUrlQuery'

import { AFFILIATE_COOKIE_KEY, COOKIE_EXPIRE_DAYS } from '@/constants'

const useAffiliate = () => {
  const { getQueryParam, removeQueryParam } = useUrlQuery()

  const getReferralFromCookie = useCallback(() => {
    return Cookies.get(AFFILIATE_COOKIE_KEY)
  }, [])

  const clearReferral = useCallback(() => {
    Cookies.remove(AFFILIATE_COOKIE_KEY)
  }, [])

  useEffect(() => {
    const refFromUrl = getQueryParam('ref')

    if (refFromUrl) {
      Cookies.set(AFFILIATE_COOKIE_KEY, refFromUrl, {
        expires: COOKIE_EXPIRE_DAYS,
        path: '/',
        sameSite: 'lax',
      })

      removeQueryParam('ref')
    }
  }, [getQueryParam, removeQueryParam])

  return {
    referralNo: getReferralFromCookie(),
    getReferralFromCookie,
    clearReferral,
  }
}

export { useAffiliate }
