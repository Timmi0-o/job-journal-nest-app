/**
 * Error severity levels.
 * Used to classify how critical an error is and how it should be handled.
 */
export enum ErrorSeverity {
  /**
   * Low severity - error does not significantly affect operation.
   * Example: Validation warnings, minor data issues.
   */
  LOW = 'LOW',

  /**
   * Medium severity - error has partial impact on operation.
   * Example: Non-critical feature failure, degraded functionality.
   */
  MEDIUM = 'MEDIUM',

  /**
   * High severity - error significantly impacts operation.
   * Example: Core feature failure, data inconsistency.
   */
  HIGH = 'HIGH',

  /**
   * Critical severity - error requires immediate attention.
   * Example: System failure, data loss, security breach.
   */
  CRITICAL = 'CRITICAL',
}

/**
 * Numeric weights for severity levels.
 * Useful for comparison and sorting.
 */
export const SEVERITY_WEIGHTS: Readonly<Record<ErrorSeverity, number>> = {
  [ErrorSeverity.LOW]: 1,
  [ErrorSeverity.MEDIUM]: 2,
  [ErrorSeverity.HIGH]: 3,
  [ErrorSeverity.CRITICAL]: 4,
} as const;

/**
 * Compare two severity levels.
 * Returns: negative if a < b, 0 if a === b, positive if a > b.
 */
export function compareSeverity(a: ErrorSeverity, b: ErrorSeverity): number {
  return SEVERITY_WEIGHTS[a] - SEVERITY_WEIGHTS[b];
}

/**
 * Check if severity level is at least as severe as the minimum.
 */
export function isAtLeastSeverity(severity: ErrorSeverity, minimum: ErrorSeverity): boolean {
  return SEVERITY_WEIGHTS[severity] >= SEVERITY_WEIGHTS[minimum];
}

/**
 * Get the higher severity level between two.
 */
export function getHigherSeverity(a: ErrorSeverity, b: ErrorSeverity): ErrorSeverity {
  return SEVERITY_WEIGHTS[a] >= SEVERITY_WEIGHTS[b] ? a : b;
}
