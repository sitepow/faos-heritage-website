import type { ErrorCode } from './codes'

import { ERROR_CODES } from './codes'

export const ERROR_MESSAGE_MAP: Record<ErrorCode, string> = {
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password.',

  [ERROR_CODES.EMAIL_ALREADY_USED]:
    'This email address has already been used. Please use a different email address and try again.',

  [ERROR_CODES.SOCIAL_ACCOUNT_EXISTS]:
    'This account was registered with Google/Facebook. Please log in using that method.',

  [ERROR_CODES.ACCOUNT_SUSPENDED]:
    'This account has been suspended. Please contact your administrator.',

  [ERROR_CODES.PASSWORD_TOO_SHORT]:
    'The password must be at least 6 characters long.',

  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid input data.',

  [ERROR_CODES.SYSTEM_ERROR]: 'Something went wrong. Please try again.',

  [ERROR_CODES.DATA_NOT_FOUND]: 'Data not found.',

  [ERROR_CODES.DATA_ALREADY_EXISTS]: 'This data already exists.',

  [ERROR_CODES.DATA_FIELD_REQUIRED]: 'Required field is missing.',

  [ERROR_CODES.DATA_INSUFFICIENT]: 'Insufficient data',
}
