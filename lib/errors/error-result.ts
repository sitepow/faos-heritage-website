import type { ErrorCode } from './error-codes'

type ActionSuccess<T = void> = {
  success: true
  data: T
}

type ActionFail = {
  success: false
  code: ErrorCode
  message?: string
  meta?: Record<string, unknown>
}

type ActionResult<T = void> = ActionSuccess<T> | ActionFail

export type { ActionFail, ActionResult, ActionSuccess }
