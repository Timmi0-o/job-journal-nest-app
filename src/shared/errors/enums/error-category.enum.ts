/**
 * Error categories for classification and handling.
 * Helps determine how to handle, log, and respond to errors.
 */
export enum ErrorCategory {
  /**
   * General errors that don't fit other categories.
   */
  GENERAL = 'GENERAL',

  /**
   * Business logic and rule violations.
   */
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',

  /**
   * Input validation errors.
   */
  VALIDATION = 'VALIDATION',

  /**
   * Authentication errors (identity verification).
   */
  AUTHENTICATION = 'AUTHENTICATION',

  /**
   * Authorization errors (permission/access control).
   */
  AUTHORIZATION = 'AUTHORIZATION',

  /**
   * Database and data storage errors.
   */
  DATABASE = 'DATABASE',

  /**
   * External service communication errors.
   */
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',

  /**
   * Network connectivity errors.
   */
  NETWORK = 'NETWORK',

  /**
   * Timeout and deadline errors.
   */
  TIMEOUT = 'TIMEOUT',

  /**
   * Configuration and setup errors.
   */
  CONFIGURATION = 'CONFIGURATION',

  /**
   * System-level errors.
   */
  SYSTEM = 'SYSTEM',

  /**
   * Resource management errors (rate limiting, quotas).
   */
  RESOURCE = 'RESOURCE',

  /**
   * Data integrity and consistency errors.
   */
  DATA_INTEGRITY = 'DATA_INTEGRITY',

  /**
   * Serialization/deserialization errors.
   */
  SERIALIZATION = 'SERIALIZATION',
}

/**
 * Mapping of categories to their recommended log levels.
 */
export const CATEGORY_LOG_LEVELS: Readonly<
  Record<ErrorCategory, 'debug' | 'info' | 'warn' | 'error'>
> = {
  [ErrorCategory.GENERAL]: 'error',
  [ErrorCategory.BUSINESS_LOGIC]: 'warn',
  [ErrorCategory.VALIDATION]: 'info',
  [ErrorCategory.AUTHENTICATION]: 'warn',
  [ErrorCategory.AUTHORIZATION]: 'warn',
  [ErrorCategory.DATABASE]: 'error',
  [ErrorCategory.EXTERNAL_SERVICE]: 'error',
  [ErrorCategory.NETWORK]: 'error',
  [ErrorCategory.TIMEOUT]: 'warn',
  [ErrorCategory.CONFIGURATION]: 'error',
  [ErrorCategory.SYSTEM]: 'error',
  [ErrorCategory.RESOURCE]: 'warn',
  [ErrorCategory.DATA_INTEGRITY]: 'error',
  [ErrorCategory.SERIALIZATION]: 'error',
} as const;

/**
 * Categories that should be alerted to operations/on-call.
 */
export const ALERTABLE_CATEGORIES: ReadonlyArray<ErrorCategory> = [
  ErrorCategory.DATABASE,
  ErrorCategory.SYSTEM,
  ErrorCategory.DATA_INTEGRITY,
  ErrorCategory.CONFIGURATION,
] as const;

/**
 * Check if an error category should trigger an alert.
 */
export function shouldAlertCategory(category: ErrorCategory): boolean {
  return ALERTABLE_CATEGORIES.includes(category);
}

/**
 * Categories that are typically caused by client/user errors.
 */
export const CLIENT_ERROR_CATEGORIES: ReadonlyArray<ErrorCategory> = [
  ErrorCategory.VALIDATION,
  ErrorCategory.AUTHENTICATION,
  ErrorCategory.AUTHORIZATION,
  ErrorCategory.BUSINESS_LOGIC,
] as const;

/**
 * Check if an error category is typically a client error.
 */
export function isClientErrorCategory(category: ErrorCategory): boolean {
  return CLIENT_ERROR_CATEGORIES.includes(category);
}
