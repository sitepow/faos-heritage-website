import type { ErrorCode } from './codes'

export type ActionSuccess<T = void> = {
  success: true
  data: T
}

export type ActionFail = {
  success: false
  code: ErrorCode
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionFail
