import type { ErrorCode } from './error-codes'

const ERROR_MESSAGE_MAP: Record<ErrorCode, string> = {
  SYSTEM_ERROR: 'Something went wrong. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Some information is invalid. Please check and try again.',
  OPERATION_NOT_ALLOWED: 'This operation is not allowed.',

  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Please log in to continue.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  EMAIL_ALREADY_USED: 'This email is already in use.',
  SOCIAL_ACCOUNT_EXISTS:
    'This account was registered using a social login. Please use that method.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',

  DATA_NOT_FOUND: 'The requested information was not found.',
  FIELD_REQUIRED: 'Please fill in all the required information.',

  USER_ALREADY_EXISTS: 'This user already exists.',
  USER_ADDRESS_NOT_FOUND: 'Shipping address not found.',

  PRODUCT_NOT_AVAILABLE: 'This product is currently unavailable.',
  PRODUCT_OUT_OF_STOCK: 'This product is out of stock.',
  PRODUCT_PRICE_CHANGED:
    'The product price has changed. Please review your cart.',
  PRODUCT_DISABLED: 'This product is no longer available.',

  CART_EMPTY: 'Your cart is empty.',
  CART_ITEM_OUT_OF_STOCK: 'One or more items in your cart are out of stock.',
  CART_LIMIT_EXCEEDED:
    'You have reached the maximum allowed quantity for this item.',

  ORDER_ALREADY_PAID: 'This order has already been paid.',
  ORDER_ALREADY_CANCELLED: 'This order has already been cancelled.',
  ORDER_CANNOT_BE_CANCELLED: 'This order can no longer be cancelled.',
  ORDER_STATUS_INVALID: 'Invalid order status. Please refresh and try again.',

  PAYMENT_FAILED: 'Payment failed. Please try again.',
  PAYMENT_DECLINED: 'Payment was declined. Please use another payment method.',
  PAYMENT_METHOD_INVALID: 'Invalid payment method.',
  PAYMENT_AMOUNT_MISMATCH: 'Payment amount does not match the order total.',
  PAYMENT_ALREADY_COMPLETED: 'This payment has already been completed.',
  PAYMENT_PROVIDER_ERROR:
    'Payment service is currently unavailable. Please try again later.',

  SHIPPING_ADDRESS_INVALID:
    'Invalid shipping address. Please check and try again.',
  SHIPPING_METHOD_NOT_SUPPORTED: 'Selected shipping method is not supported.',
  SHIPPING_RATE_NOT_FOUND: 'Unable to calculate shipping cost at this time.',

  COUPON_EXPIRED: 'This coupon has expired.',
  COUPON_USAGE_LIMIT_REACHED: 'This coupon has reached its usage limit.',
  COUPON_NOT_APPLICABLE: 'This coupon cannot be applied to your order.',

  STOCK_INSUFFICIENT: 'Insufficient stock available for the selected quantity.',

  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
  FILE_TOO_LARGE: 'The selected file is too large.',
  FILE_TYPE_NOT_SUPPORTED: 'This file type is not supported.',

  FORBIDDEN: 'You do not have permission to perform this action.',
  INSUFFICIENT_PERMISSION: 'Insufficient permission to proceed.',

  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
}

export { ERROR_MESSAGE_MAP }
