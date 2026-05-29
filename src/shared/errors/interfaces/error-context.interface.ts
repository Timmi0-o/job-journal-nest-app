/**
 * Context information about where and when an error occurred.
 * Useful for debugging and tracing errors across microservices.
 */
export interface IErrorContext {
  /**
   * User identifier who triggered the operation.
   */
  userId?: string;

  /**
   * Unique request identifier for tracing.
   */
  requestId?: string;

  /**
   * Distributed trace identifier.
   */
  traceId?: string;

  /**
   * Span identifier within a trace.
   */
  spanId?: string;

  /**
   * Parent span identifier.
   */
  parentSpanId?: string;

  /**
   * Name of the service where error occurred.
   */
  serviceName?: string;

  /**
   * Version of the service.
   */
  serviceVersion?: string;

  /**
   * Name of the method/function where error occurred.
   */
  methodName?: string;

  /**
   * Class name where error occurred.
   */
  className?: string;

  /**
   * Endpoint or message pattern being processed.
   */
  endpoint?: string;

  /**
   * HTTP method or message pattern type.
   */
  method?: string;

  /**
   * Request parameters (sanitized).
   */
  params?: Record<string, unknown>;

  /**
   * Request headers (sanitized).
   */
  headers?: Record<string, string>;

  /**
   * Client IP address.
   */
  clientIp?: string;

  /**
   * User agent string.
   */
  userAgent?: string;

  /**
   * Environment (development, staging, production).
   */
  environment?: string;

  /**
   * Hostname of the server.
   */
  hostname?: string;

  /**
   * Process ID.
   */
  pid?: number;

  /**
   * Timestamp when the operation started.
   */
  startTime?: Date;

  /**
   * Duration of the operation in milliseconds.
   */
  durationMs?: number;

  /**
   * Additional custom context.
   */
  custom?: Record<string, unknown>;
}

/**
 * Create a minimal error context from environment.
 */
export function createMinimalContext(serviceName?: string): Partial<IErrorContext> {
  return {
    serviceName,
    hostname: typeof process !== 'undefined' ? process.env.HOSTNAME : undefined,
    pid: typeof process !== 'undefined' ? process.pid : undefined,
    environment: typeof process !== 'undefined' ? process.env.NODE_ENV : undefined,
  };
}
