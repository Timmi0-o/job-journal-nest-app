import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../constants/error-codes.constant';
import { ErrorSeverity } from '../../enums/error-severity.enum';
import { ErrorCategory } from '../../enums/error-category.enum';
import { IBaseErrorOptions } from '../../interfaces/error-options.interface';
import { BaseError } from '../base/base-error';

/**
 * Error thrown when a business rule is violated.
 *
 * Use this error for:
 * - Business logic violations
 * - State machine transitions
 * - Precondition failures
 * - Domain invariant violations
 *
 * @example
 * ```typescript
 * throw new BusinessRuleError('Cannot cancel an already shipped order', 'ORDER_CANCEL_SHIPPED');
 * throw BusinessRuleError.preconditionFailed('Order must be in pending state to be approved');
 * ```
 */
export class BusinessRuleError extends BaseError {
  /**
   * Specific business rule code that was violated.
   */
  public readonly ruleCode?: string;

  /**
   * Entity type that the rule applies to.
   */
  public readonly entityType?: string;

  /**
   * Entity ID that the rule applies to.
   */
  public readonly entityId?: string | number;

  /**
   * Current state of the entity (for state machine violations).
   */
  public readonly currentState?: string;

  /**
   * Expected state of the entity.
   */
  public readonly expectedState?: string;

  constructor(
    message: string,
    ruleCode?: string,
    options?: IBaseErrorOptions & {
      entityType?: string;
      entityId?: string | number;
      currentState?: string;
      expectedState?: string;
    },
  ) {
    super(message, HttpStatus.PRECONDITION_FAILED, ruleCode ?? ErrorCodes.BUSINESS_RULE_VIOLATION, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.BUSINESS_LOGIC,
      ...options,
      metadata: {
        ...options?.metadata,
        ruleCode,
        entityType: options?.entityType,
        entityId: options?.entityId,
        currentState: options?.currentState,
        expectedState: options?.expectedState,
      },
    });

    this.ruleCode = ruleCode;
    this.entityType = options?.entityType;
    this.entityId = options?.entityId;
    this.currentState = options?.currentState;
    this.expectedState = options?.expectedState;
  }

  /**
   * Create a BusinessRuleError for a precondition failure.
   */
  static preconditionFailed(message: string, options?: IBaseErrorOptions): BusinessRuleError {
    return new BusinessRuleError(message, ErrorCodes.PRECONDITION_FAILED, {
      ...options,
      metadata: {
        ...options?.metadata,
        type: 'PRECONDITION_FAILED',
      },
    });
  }

  /**
   * Create a BusinessRuleError for invalid state transition.
   */
  static invalidStateTransition(
    entityType: string,
    entityId: string | number,
    currentState: string,
    targetState: string,
    options?: IBaseErrorOptions,
  ): BusinessRuleError {
    return new BusinessRuleError(
      `Cannot transition ${entityType} '${entityId}' from '${currentState}' to '${targetState}'`,
      ErrorCodes.INVALID_STATE,
      {
        ...options,
        entityType,
        entityId,
        currentState,
        expectedState: targetState,
        metadata: {
          ...options?.metadata,
          type: 'INVALID_STATE_TRANSITION',
          targetState,
        },
      },
    );
  }

  /**
   * Create a BusinessRuleError for invalid operation in current state.
   */
  static invalidOperationForState(
    operation: string,
    entityType: string,
    currentState: string,
    allowedStates: string[],
    options?: IBaseErrorOptions,
  ): BusinessRuleError {
    return new BusinessRuleError(
      `Operation '${operation}' is not allowed when ${entityType} is in '${currentState}' state. Allowed states: ${allowedStates.join(', ')}`,
      ErrorCodes.INVALID_OPERATION,
      {
        ...options,
        entityType,
        currentState,
        metadata: {
          ...options?.metadata,
          type: 'INVALID_OPERATION_FOR_STATE',
          operation,
          allowedStates,
        },
      },
    );
  }

  /**
   * Create a BusinessRuleError for operation not allowed.
   */
  static operationNotAllowed(
    operation: string,
    reason?: string,
    options?: IBaseErrorOptions,
  ): BusinessRuleError {
    const message = reason
      ? `Operation '${operation}' is not allowed: ${reason}`
      : `Operation '${operation}' is not allowed`;

    return new BusinessRuleError(message, ErrorCodes.OPERATION_NOT_ALLOWED, {
      ...options,
      metadata: {
        ...options?.metadata,
        type: 'OPERATION_NOT_ALLOWED',
        operation,
        reason,
      },
    });
  }
}
