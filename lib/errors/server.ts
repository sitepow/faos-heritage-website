import type { ErrorCode } from './codes'
import type { ActionFail, ActionSuccess } from './types'

export const fail = (code: ErrorCode): ActionFail => ({
  success: false,
  code,
})

export const done = <T = void>(data?: T): ActionSuccess<T> => ({
  success: true,
  data: data as T,
})
