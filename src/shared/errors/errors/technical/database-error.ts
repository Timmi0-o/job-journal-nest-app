import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IDatabaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown for database operation failures.
 *
 * Use this error for:
 * - Query failures
 * - Connection issues
 * - Constraint violations
 * - Transaction errors
 *
 * @example
 * ```typescript
 * throw new DatabaseError('Failed to insert user', {
 *   operation: 'INSERT',
 *   table: 'users',
 * });
 * throw DatabaseError.constraintViolation('unique_email', 'users');
 * ```
 */
export class DatabaseError extends BaseError {
  /**
   * Database operation that failed.
   */
  public readonly operation?: string;

  /**
   * Table/collection name.
   */
  public readonly table?: string;

  /**
   * Constraint that was violated.
   */
  public readonly constraint?: string;

  /**
   * Original database error code.
   */
  public readonly dbErrorCode?: string;

  constructor(message: string, options?: IDatabaseErrorOptions) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCodes.DATABASE_ERROR, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.DATABASE,
      ...options,
      metadata: {
        ...options?.metadata,
        operation: options?.operation,
        table: options?.table,
        constraint: options?.constraint,
        dbErrorCode: options?.dbErrorCode,
      },
    });

    this.operation = options?.operation;
    this.table = options?.table;
    this.constraint = options?.constraint;
    this.dbErrorCode = options?.dbErrorCode;
  }

  /**
   * Create a DatabaseError for unique constraint violation.
   */
  static uniqueConstraintViolation(
    field: string,
    table?: string,
    options?: Omit<IDatabaseErrorOptions, 'constraint' | 'table'>,
  ): DatabaseError {
    return new DatabaseError(
      `Unique constraint violation on field '${field}'${table ? ` in table '${table}'` : ''}`,
      {
        ...options,
        table,
        constraint: `unique_${field}`,
        metadata: {
          ...options?.metadata,
          type: 'UNIQUE_CONSTRAINT_VIOLATION',
          field,
        },
      },
    );
  }

  /**
   * Create a DatabaseError for foreign key violation.
   */
  static foreignKeyViolation(
    constraint: string,
    table?: string,
    options?: Omit<IDatabaseErrorOptions, 'constraint' | 'table'>,
  ): DatabaseError {
    return new DatabaseError(
      `Foreign key constraint '${constraint}' violated${table ? ` in table '${table}'` : ''}`,
      {
        ...options,
        table,
        constraint,
        metadata: {
          ...options?.metadata,
          type: 'FOREIGN_KEY_VIOLATION',
        },
      },
    );
  }

  /**
   * Create a DatabaseError for connection failure.
   */
  static connectionFailed(options?: IDatabaseErrorOptions): DatabaseError {
    return new DatabaseError('Database connection failed', {
      ...options,
      severity: ErrorSeverity.CRITICAL,
      isRetriable: true,
      metadata: {
        ...options?.metadata,
        type: 'CONNECTION_FAILED',
      },
    });
  }

  /**
   * Create a DatabaseError for transaction failure.
   */
  static transactionFailed(reason?: string, options?: IDatabaseErrorOptions): DatabaseError {
    const message = reason ? `Transaction failed: ${reason}` : 'Transaction failed';

    return new DatabaseError(message, {
      ...options,
      operation: 'TRANSACTION',
      metadata: {
        ...options?.metadata,
        type: 'TRANSACTION_FAILED',
        reason,
      },
    });
  }

  /**
   * Create a DatabaseError for query failure.
   */
  static queryFailed(
    operation: string,
    table?: string,
    options?: Omit<IDatabaseErrorOptions, 'operation' | 'table'>,
  ): DatabaseError {
    return new DatabaseError(
      `Database ${operation} operation failed${table ? ` on table '${table}'` : ''}`,
      {
        ...options,
        operation,
        table,
        metadata: {
          ...options?.metadata,
          type: 'QUERY_FAILED',
        },
      },
    );
  }

  /**
   * Create a DatabaseError for deadlock.
   */
  static deadlock(options?: IDatabaseErrorOptions): DatabaseError {
    return new DatabaseError('Database deadlock detected', {
      ...options,
      isRetriable: true,
      metadata: {
        ...options?.metadata,
        type: 'DEADLOCK',
      },
    });
  }

  /**
   * Create a DatabaseError for data integrity violation.
   */
  static dataIntegrityViolation(message: string, options?: IDatabaseErrorOptions): DatabaseError {
    return new DatabaseError(message, {
      ...options,
      category: ErrorCategory.DATA_INTEGRITY,
      metadata: {
        ...options?.metadata,
        type: 'DATA_INTEGRITY_VIOLATION',
      },
    });
  }
}
