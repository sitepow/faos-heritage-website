import { Role } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'

import type { UserLoginInput, UserRegisterInput } from '@/features/user/schema'
import type { ActionResult } from '@/lib/errors'
import type { ErrorCode } from '@/lib/errors/error-codes'

import { createUser } from '@/features/user/action'
import { ERROR_CODES } from '@/lib/errors/error-codes'

const useAuthForm = (callbackUrl: string) => {
  const loginMutation = useMutation({
    mutationFn: async (form: UserLoginInput): Promise<ActionResult<void>> => {
      const res = await signIn('credentials', {
        ...form,
        redirect: false,
      })

      if (res?.error) {
        const errorCode: ErrorCode =
          res.error === 'CredentialsSignin'
            ? ERROR_CODES.INVALID_CREDENTIALS
            : (res.error as ErrorCode)

        return {
          success: false,
          code: errorCode,
        }
      }

      return {
        success: true,
        data: undefined,
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        window.location.href = callbackUrl
      }
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: UserRegisterInput) => {
      return createUser({
        ...data,
        isActive: true,
        roles: [Role.CUSTOMER],
      })
    },
    onSuccess: async (result, form) => {
      if (!result.success) {
        return
      }

      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        window.location.href = '/login'
        return
      }

      window.location.href = callbackUrl
    },
  })

  return {
    loginMutation,
    registerMutation,
    isPending: loginMutation.isPending || registerMutation.isPending,
  }
}

export { useAuthForm }
