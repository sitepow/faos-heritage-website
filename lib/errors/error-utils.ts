import type { ErrorCode } from './error-codes'
import type { ActionFail, ActionSuccess } from './error-result'

import { ERROR_MESSAGE_MAP } from './error-messages'

const fail = (code: ErrorCode, meta?: Record<string, unknown>): ActionFail => ({
  success: false,
  code,
  message: ERROR_MESSAGE_MAP[code],
  meta,
})

const ok = <T = void>(data?: T): ActionSuccess<T> => ({
  success: true,
  data: data as T,
})

export { fail, ok }
