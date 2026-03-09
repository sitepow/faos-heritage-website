import { Role } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import type {
  UserLoginInput,
  UserRegisterInput,
} from '@/features/user/user.schema'
import type { ActionResult } from '@/lib/errors'
import type { ErrorCode } from '@/lib/errors/error-codes'

import { createUser } from '@/features/user/user.action'

const useAuthForm = (callbackUrl: string) => {
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: async (form: UserLoginInput): Promise<ActionResult<void>> => {
      const res = await signIn('credentials', {
        ...form,
        redirect: false,
      })

      if (res?.error) {
        return {
          success: false,
          code: res.error as ErrorCode,
        }
      }

      return {
        success: true,
        data: undefined,
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        router.push(callbackUrl)
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

      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      router.push(callbackUrl)
    },
  })

  return {
    loginMutation,
    registerMutation,
    isPending: loginMutation.isPending || registerMutation.isPending,
  }
}

export { useAuthForm }
