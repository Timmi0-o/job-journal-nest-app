import { isRetriableHttpStatus } from '../../constants/http-status.helpers';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IErrorMetadata } from '../../interfaces/error-metadata.interface';
import { IErrorContext } from '../../interfaces/error-context.interface';
import { ISerializedError } from '../../interfaces/serialized-error.interface';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';

export abstract class BaseError extends Error {
  public readonly timestamp: Date;
  public readonly httpStatus: number;
  public readonly errorCode: string;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly metadata: IErrorMetadata;
  public readonly context?: IErrorContext;
  public readonly isOperational: boolean;
  public readonly isRetriable: boolean;
  public readonly serviceName?: string;
  public readonly correlationId?: string;
  public readonly causedBy?: Error;

  constructor(
    message: string,
    httpStatus: number,
    errorCode: string,
    options?: IBaseErrorOptions,
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.severity = options?.severity ?? ErrorSeverity.MEDIUM;
    this.category = options?.category ?? ErrorCategory.GENERAL;
    this.metadata = options?.metadata ?? {};
    this.context = options?.context;
    this.serviceName = options?.serviceName;
    this.correlationId = options?.correlationId;
    this.causedBy = options?.causedBy;
    this.isOperational = true;
    this.isRetriable = options?.isRetriable ?? isRetriableHttpStatus(httpStatus);
  }

  public toJSON(): ISerializedError {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      severity: this.severity,
      category: this.category,
      timestamp: this.timestamp.toISOString(),
      isOperational: this.isOperational,
      isRetriable: this.isRetriable,
      metadata: this.metadata,
      context: this.context,
      serviceName: this.serviceName,
      correlationId: this.correlationId,
      httpStatus: this.httpStatus,
      causedBy: this.causedBy?.message,
    };
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  protected clone(overrides: Partial<BaseError>): this {
    const prototype = Object.getPrototypeOf(this) as object;
    const clone = Object.create(prototype) as this;
    Object.assign(clone, this, overrides);

    Object.defineProperty(clone, 'message', {
      value: overrides.message ?? this.message,
      writable: true,
      enumerable: false,
      configurable: true,
    });

    clone.name = this.name;
    return clone;
  }

  public withContext(context: IErrorContext): this {
    return this.clone({
      context: { ...this.context, ...context },
    });
  }

  public withMetadata(metadata: IErrorMetadata): this {
    return this.clone({
      metadata: { ...this.metadata, ...metadata },
    });
  }

  public withCorrelationId(correlationId: string): this {
    return this.clone({ correlationId });
  }

  public withServiceName(serviceName: string): this {
    return this.clone({ serviceName });
  }

  public getErrorChain(): Error[] {
    const chain: Error[] = [this];
    let current: Error | undefined = this.causedBy;

    while (current) {
      chain.push(current);
      current = current instanceof BaseError ? current.causedBy : undefined;
    }

    return chain;
  }

  public getRootCause(): Error {
    const chain = this.getErrorChain();
    return chain[chain.length - 1];
  }

  public is<T extends BaseError>(ErrorType: new (...args: never[]) => T): this is T {
    return this instanceof ErrorType;
  }

  public toLogFormat(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      httpStatus: this.httpStatus,
      severity: this.severity,
      category: this.category,
      timestamp: this.timestamp.toISOString(),
      isOperational: this.isOperational,
      isRetriable: this.isRetriable,
      serviceName: this.serviceName,
      correlationId: this.correlationId,
      metadata: this.metadata,
      context: this.context,
      causedBy: this.causedBy?.message,
      stack: this.stack,
    };
  }

  public override toString(): string {
    const parts = [
      `${this.name}: ${this.message}`,
      `[${this.errorCode}]`,
      `HTTP: ${this.httpStatus}`,
    ];

    if (this.correlationId) {
      parts.push(`correlationId: ${this.correlationId}`);
    }

    return parts.join(' | ');
  }
}

export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}
