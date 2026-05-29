/**
 * Generic metadata that can be attached to any error.
 * Used to provide additional context about the error.
 */
export interface IErrorMetadata {
  /**
   * Additional data relevant to the error.
   */
  [key: string]: unknown;
}

/**
 * Validation error details.
 * Maps field names to their validation error messages.
 */
export interface IValidationErrorDetails {
  /**
   * Field name to array of validation error messages.
   */
  [field: string]: string[];
}

/**
 * Resource-related error metadata.
 */
export interface IResourceErrorMetadata extends IErrorMetadata {
  /**
   * Type of resource (e.g., 'User', 'Order', 'Product').
   */
  resourceType?: string;

  /**
   * Resource identifier.
   */
  resourceId?: string | number;

  /**
   * Additional resource attributes.
   */
  resourceAttributes?: Record<string, unknown>;
}

/**
 * Database error metadata.
 */
export interface IDatabaseErrorMetadata extends IErrorMetadata {
  /**
   * Database operation that failed.
   */
  operation?: string;

  /**
   * Table/collection name.
   */
  table?: string;

  /**
   * Constraint that was violated.
   */
  constraint?: string;

  /**
   * Original database error code.
   */
  dbErrorCode?: string;
}

/**
 * External service error metadata.
 */
export interface IExternalServiceErrorMetadata extends IErrorMetadata {
  /**
   * Name of the external service.
   */
  serviceName?: string;

  /**
   * Endpoint that was called.
   */
  endpoint?: string;

  /**
   * HTTP status code from external service.
   */
  statusCode?: number;

  /**
   * Response from external service.
   */
  response?: unknown;

  /**
   * Request duration in milliseconds.
   */
  durationMs?: number;
}

/**
 * Timeout error metadata.
 */
export interface ITimeoutErrorMetadata extends IErrorMetadata {
  /**
   * Operation that timed out.
   */
  operation?: string;

  /**
   * Timeout duration in milliseconds.
   */
  timeoutMs?: number;

  /**
   * Elapsed time before timeout in milliseconds.
   */
  elapsedMs?: number;
}
